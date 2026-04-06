"use client";
import { Mic, MicOff, Trash2 } from "lucide-react";
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
    <div className="relative w-24 h-36 sm:w-30 sm:h-45 shrink-0 overflow-visible">
      <Image src={coverURL} alt={title} fill className="rounded-lg shadow-lg object-cover" />

      {isActive && (status === "thinking" || status === "speaking") && (
        <span
          aria-hidden
          className="absolute rounded-full bg-white/80 animate-ping pointer-events-none z-20"
          style={{ width: 36, height: 36, right: -10, bottom: -10 }}
        />
      )}

      <button
        aria-label={isActive ? "Stop voice assistant" : "Start voice assistant"}
        title={isActive ? "Stop voice assistant" : "Start voice assistant"}
        onClick={isActive ? stop : start}
        disabled={status === "connecting" || status === "starting"}
        className="vapi-mic-btn bg-white rounded-full flex items-center justify-center shadow z-30"
        style={{ position: "absolute", width: 36, height: 36, right: -10, bottom: -10 }}
      >
        {isActive ? <MicOff size={16} className="text-[#212a3b]" /> : <Mic size={16} className="text-[#212a3b]" />}
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
  const { status, messages, currentMessage, currentUserMessage, duration, limitError, maxDurationMinutes, isActive, start, stop, clearTranscript } =
    useVapi(book);

  return (
    <div className="max-w-4xl w-full flex flex-col items-center space-y-6">
      <div className="w-full bg-[#f3e4c7] rounded-xl p-4 sm:p-6 flex items-start gap-4 sm:gap-6">
        <CoverWithMic
          coverURL={book.coverURL}
          title={book.title}
          isActive={isActive}
          start={start}
          stop={stop}
          status={status}
        />

        <div className="flex-1 min-w-0">
          <h1 className="font-serif text-xl sm:text-3xl md:text-4xl font-bold leading-tight">{book.title}</h1>
          <p className="text-sm text-[#374151] mt-1">by {book.author}</p>

          <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-3">
            <div className="vapi-status-indicator bg-white rounded-full px-2.5 sm:px-3 py-1 flex items-center gap-1.5 sm:gap-2">
              <span className={`w-2 h-2 rounded-full block shrink-0 ${isActive ? "bg-green-500" : "bg-gray-400"}`} />
              <span className="text-xs sm:text-sm">{STATUS_LABELS[status]}</span>
            </div>
            <div className="hidden sm:flex vapi-status-indicator bg-white rounded-full px-3 py-1 text-sm">
              Voice: {book.persona || "rachel"}
            </div>
            <div className="vapi-status-indicator bg-white rounded-full px-2.5 sm:px-3 py-1 text-xs sm:text-sm">
              {formatDuration(duration)}/{maxDurationMinutes === null ? "--:--" : formatDuration(maxDurationMinutes * 60)}
            </div>
          </div>

          {limitError && <p className="mt-3 text-sm text-red-600 font-medium">{limitError}</p>}
        </div>
      </div>

      <div className="w-full flex flex-col gap-3">
        {messages.length > 0 && !isActive && (
          <div className="flex justify-end">
            <button
              onClick={clearTranscript}
              className="flex cursor-pointer items-center gap-1.5 text-sm text-[#374151] hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear conversation
            </button>
          </div>
        )}
        <Transcript messages={messages} currentMessage={currentMessage} currentUserMessage={currentUserMessage} />
      </div>
    </div>
  );
};

export default VapiControls;
