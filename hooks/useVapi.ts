import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { IBook, Messages } from "@/types";
import { ASSISTANT_ID, DEFAULT_VOICE, VOICE_SETTINGS } from "@/lib/constants";
import { clearBookTranscript, endVoiceSession, getBookTranscript, getMaxSessionDuration, saveBookTranscript, startVoiceSession } from "@/lib/actions/session.actions";
import Vapi from "@vapi-ai/web";
import { getVoice } from "@/lib/utils";

export type CallStatus = "idle" | "connecting" | "starting" | "listening" | "thinking" | "speaking";

const VAPI_API_KEY = process.env.NEXT_PUBLIC_VAPI_KEY;
let vapi: InstanceType<typeof Vapi>;

function getVapi() {
  if (!vapi) {
    if (!VAPI_API_KEY) {
      throw new Error("VAPI API key is not set. Please set NEXT_PUBLIC_VAPI_KEY in your environment variables.");
    }
    vapi = new Vapi(VAPI_API_KEY);
  }
  return vapi;
}

function buildResumeFirstMessage(bookTitle: string): string {
  return `Welcome back! Let's pick up our conversation about "${bookTitle}" right where we left off.`;
}

export const useVapi = (book: IBook) => {
  const { userId } = useAuth();

  const [status, setStatus] = useState<CallStatus>("idle");
  const [messages, setMessages] = useState<Messages[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentUserMessage, setCurrentUserMessage] = useState("");
  const [duration, setDuration] = useState(0);
  const [limitError, setLimitError] = useState<string | null>(null);
  const [maxDurationMinutes, setMaxDurationMinutes] = useState<number | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const isStoppingRef = useRef<boolean>(false);
  const maxDurationMinutesRef = useRef<number | null>(null);
  const messagesRef = useRef<Messages[]>([]);

  const voice = book.persona || DEFAULT_VOICE;
  const isActive = status === "listening" || status === "thinking" || status === "speaking" || status === "starting";

  // Keep messagesRef in sync so event handlers always see the latest messages
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Load persisted transcript and plan limit on mount
  useEffect(() => {
    getBookTranscript(book._id).then((saved) => {
      if (saved.length > 0) setMessages(saved);
    });
    getMaxSessionDuration().then((minutes) => {
      maxDurationMinutesRef.current = minutes;
      setMaxDurationMinutes(minutes);
    });
  }, [book._id]);

  useEffect(() => {
    const vapiInstance = getVapi();

    const onCallStart = () => {
      isStoppingRef.current = false;
      setStatus("listening");
      startTimeRef.current = Date.now();

      timerRef.current = setInterval(() => {
        if (startTimeRef.current === null) return;

        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setDuration(elapsed);

        const limitSeconds =
          maxDurationMinutesRef.current === null ? null : maxDurationMinutesRef.current * 60;

        if (limitSeconds !== null && elapsed >= limitSeconds) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          isStoppingRef.current = true;

          if (sessionIdRef.current) {
            endVoiceSession(sessionIdRef.current, elapsed).catch(console.error);
            sessionIdRef.current = null;
          }

          saveBookTranscript(book._id, messagesRef.current).catch(console.error);
          setStatus("idle");
          setCurrentMessage("");
          setCurrentUserMessage("");
          setLimitError("Session time limit reached. Upgrade your plan for longer sessions.");
          getVapi().stop();
        }
      }, 1000);
    };

    const onCallEnd = () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;

      if (isStoppingRef.current) {
        isStoppingRef.current = false;
        return;
      }

      // Unexpected end (network drop, remote hang-up, etc.)
      if (sessionIdRef.current && startTimeRef.current) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        endVoiceSession(sessionIdRef.current, elapsed).catch(console.error);
        sessionIdRef.current = null;
      }
      saveBookTranscript(book._id, messagesRef.current).catch(console.error);
      setStatus("idle");
      setCurrentMessage("");
      setCurrentUserMessage("");
    };

    const onSpeechStart = () => {
      if (isStoppingRef.current) return;
      setStatus("listening");
    };

    const onSpeechEnd = () => {
      if (isStoppingRef.current) return;
      setStatus("thinking");
    };

    const onMessage = (message: Record<string, unknown>) => {
      if (isStoppingRef.current) return;
      if (message.type !== "transcript") return;

      const role = message.role as string;
      const text = (message.transcript as string) || "";
      const transcriptType = message.transcriptType as string;

      if (role === "user") {
        if (transcriptType === "partial") {
          setCurrentUserMessage(text);
        } else if (transcriptType === "final") {
          setCurrentUserMessage("");
          setStatus("thinking");
          setMessages((prev) => {
            const isDuplicate = prev.length > 0 && prev.at(-1)!.role === "user" && prev.at(-1)!.content === text;
            return isDuplicate ? prev : [...prev, { role: "user", content: text }];
          });
        }
      } else if (role === "assistant") {
        if (transcriptType === "partial") {
          setCurrentMessage(text);
          setStatus("speaking");
        } else if (transcriptType === "final") {
          setCurrentMessage("");
          setStatus("listening");
          setMessages((prev) => {
            const isDuplicate =
              prev.length > 0 && prev.at(-1)!.role === "assistant" && prev.at(-1)!.content === text;
            return isDuplicate ? prev : [...prev, { role: "assistant", content: text }];
          });
        }
      }
    };

    const onError = (error: unknown) => {
      console.error("VAPI error:", error);
      if (isStoppingRef.current) return;
      setStatus("idle");
      setLimitError("Voice connection error. Please try again.");
    };

    vapiInstance.on("call-start", onCallStart);
    vapiInstance.on("call-end", onCallEnd);
    vapiInstance.on("speech-start", onSpeechStart);
    vapiInstance.on("speech-end", onSpeechEnd);
    vapiInstance.on("message", onMessage);
    vapiInstance.on("error", onError);

    return () => {
      vapiInstance.off("call-start", onCallStart);
      vapiInstance.off("call-end", onCallEnd);
      vapiInstance.off("speech-start", onSpeechStart);
      vapiInstance.off("speech-end", onSpeechEnd);
      vapiInstance.off("message", onMessage);
      vapiInstance.off("error", onError);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const start = async () => {
    if (!userId) return setLimitError("You must be signed in to start a session.");
    setLimitError(null);
    setStatus("connecting");

    try {
      const result = await startVoiceSession(userId, book._id);

      if (!result.success) {
        setLimitError(result.error || "Session limit reached. Please upgrade your plan.");
        setStatus("idle");
        return;
      }

      sessionIdRef.current = result.sessionId || null;
      maxDurationMinutesRef.current = result.maxDurationMinutes ?? null;
      setMaxDurationMinutes(result.maxDurationMinutes ?? null);

      const isResuming = messages.length > 0;
      const firstMessage = isResuming
        ? buildResumeFirstMessage(book.title)
        : `Hey, nice to meet you. Quick question before we dive in: have you actually read ${book.title} yet or are we starting fresh?`;

      await getVapi().start(ASSISTANT_ID, {
        firstMessage,
        variableValues: {
          title: book.title,
          author: book.author,
          bookId: book._id,
        },
        voice: {
          provider: "11labs" as const,
          voiceId: getVoice(voice).id,
          model: "eleven_turbo_v2_5" as const,
          stability: VOICE_SETTINGS.stability,
          similarityBoost: VOICE_SETTINGS.similarityBoost,
          style: VOICE_SETTINGS.style,
          useSpeakerBoost: VOICE_SETTINGS.useSpeakerBoost,
        },
      });
    } catch (e) {
      console.error("Error starting call:", e);
      if (sessionIdRef.current) {
        endVoiceSession(sessionIdRef.current, 0).catch((endErr) =>
          console.error("Failed to rollback voice session after start failure:", endErr),
        );
        sessionIdRef.current = null;
      }
      setStatus("idle");
      setLimitError("Failed to start session. Please try again.");
    }
  };

  const stop = async () => {
    isStoppingRef.current = true;

    if (sessionIdRef.current && startTimeRef.current) {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      endVoiceSession(sessionIdRef.current, elapsed).catch(console.error);
      sessionIdRef.current = null;
    }

    await getVapi().stop();

    saveBookTranscript(book._id, messagesRef.current).catch(console.error);
    setStatus("idle");
    setCurrentMessage("");
    setCurrentUserMessage("");
  };

  const clearErrors = () => setLimitError(null);

  const clearTranscript = async () => {
    await clearBookTranscript(book._id);
    setMessages([]);
    messagesRef.current = [];
  };

  return {
    status,
    messages,
    currentMessage,
    currentUserMessage,
    duration,
    limitError,
    maxDurationMinutes,
    isActive,
    start,
    stop,
    clearErrors,
    clearTranscript,
  };
};

export default useVapi;
