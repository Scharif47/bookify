"use client";
import { Mic, MicOff } from "lucide-react";
import useVapi, { CallStatus } from "@/hooks/useVapi";
import Transcript from "@/components/Transcript";
import { IBook } from "@/types";
import { formatDuration } from "@/lib/utils";
import Image from "next/image";

function CoverWithMic({
  coverURL,
  title,
  isActive,
  start,
  stop,
  status,
}: Readonly<{
  coverURL: string;
  title: string;
  isActive: boolean;
  start: () => void;
  stop: () => void;
  status: CallStatus;
}>) {
  return (
    <div className="relative w-30 h-45 shrink-0 overflow-visible">
      <Image src={coverURL} alt={title} fill className="rounded-lg shadow-lg object-cover" />

      {isActive && (status === "thinking" || status === "speaking") && (
        <span
          aria-hidden
          className="absolute rounded-full bg-white/80 animate-ping pointer-events-none z-20"
          style={{ width: 44, height: 44, right: -12, bottom: -12 }}
        />
      )}

      <button
        aria-label={isActive ? "Stop voice assistant" : "Start voice assistant"}
        title={isActive ? "Stop voice assistant" : "Start voice assistant"}
        onClick={isActive ? stop : start}
        disabled={status === "connecting" || status === "starting"}
        className="vapi-mic-btn bg-white rounded-full flex items-center justify-center shadow z-30"
        style={{ position: "absolute", width: 44, height: 44, right: -12, bottom: -12 }}
      >
        {isActive ? <Mic className="text-[#212a3b]" /> : <MicOff className="text-[#212a3b]" />}
      </button>
    </div>
  );
}

const STATUS_LABELS: Record<CallStatus, string> = {
  idle: "Ready",
  connecting: "Connecting…",
  starting: "Starting…",
  listening: "Listening",
  thinking: "Thinking",
  speaking: "Speaking",
};

const VapiControls = ({ book }: { book: IBook }) => {
  const { status, messages, currentMessage, currentUserMessage, duration, limitError, maxDurationMinutes, isActive, start, stop } =
    useVapi(book);

  return (
    <div className="max-w-4xl w-full flex flex-col items-center space-y-6">
      <div className="vapi-header-card w-full bg-[#f3e4c7] rounded-xl p-6 flex items-start gap-6">
        <CoverWithMic
          coverURL={book.coverURL}
          title={book.title}
          isActive={isActive}
          start={start}
          stop={stop}
          status={status}
        />

        <div className="flex-1">
          <h1 className="font-serif text-3xl md:text-4xl font-bold">{book.title}</h1>
          <p className="text-sm text-[#374151] mt-1">by {book.author}</p>

          <div className="mt-4 flex gap-3">
            <div className="vapi-status-indicator bg-white rounded-full px-3 py-1 flex items-center gap-2">
              <span
                className={`vapi-status-dot w-2 h-2 rounded-full block ${isActive ? "bg-green-500" : "bg-gray-400"}`}
              />
              <span className="vapi-status-text text-sm">{STATUS_LABELS[status]}</span>
            </div>

            <div className="vapi-status-indicator bg-white rounded-full px-3 py-1 text-sm">
              Voice: {book.persona || "rachel"}
            </div>

            <div className="vapi-status-indicator bg-white rounded-full px-3 py-1 text-sm">
              {formatDuration(duration)}/{maxDurationMinutes === null ? "--:--" : formatDuration(maxDurationMinutes * 60)}
            </div>
          </div>

          {limitError && <p className="mt-3 text-sm text-red-600 font-medium">{limitError}</p>}
        </div>
      </div>

      <div className="transcript-container min-h-100 w-full">
        <Transcript messages={messages} currentMessage={currentMessage} currentUserMessage={currentUserMessage} />
      </div>
    </div>
  );
};

export default VapiControls;
