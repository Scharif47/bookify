"use client";
import { Mic, MicOff } from "lucide-react";
import useVapi from "@/hooks/useVapi";
import { IBook } from "@/types";
import Image from "next/image";

function CoverWithMic({ coverURL, title }: { coverURL: string; title: string }) {
  return (
    <div className="relative w-[120px] h-[180px] flex-shrink-0 overflow-visible">
      <Image src={coverURL} alt={title} fill className="rounded-lg shadow-lg object-cover" />

      <button
        aria-label="Start speaking"
        className="vapi-mic-btn bg-white rounded-full flex items-center justify-center shadow z-30"
        style={{ position: "absolute", width: 44, height: 44, right: -12, bottom: -12 }}
      >
        <MicOff className="text-[#212a3b]" />
      </button>
    </div>
  );
}

const VapiControls = ({ book }: { book: IBook }) => {
  const {
    status,
    messages,
    currentMessage,
    currentUserMessage,
    duration,
    limitError,
    isActive,
    start,
    stop,
    clearErrors,
  } = useVapi(book);

  return (
    <div className="max-w-4xl w-full flex flex-col items-center space-y-6">
      <div className="vapi-header-card w-full bg-[#f3e4c7] rounded-xl p-6 flex items-start gap-6">
        <CoverWithMic coverURL={book.coverURL} title={book.title} />

        <div className="flex-1">
          <h1 className="font-serif text-3xl md:text-4xl font-bold">{book.title}</h1>
          <p className="text-sm text-[#374151] mt-1">by {book.author}</p>

          <div className="mt-4 flex gap-3">
            <div className="vapi-status-indicator bg-white rounded-full px-3 py-1 flex items-center gap-2">
              <span className="vapi-status-dot w-2 h-2 bg-gray-400 rounded-full block" />
              <span className="vapi-status-text text-sm">Ready</span>
            </div>

            <div className="vapi-status-indicator bg-white rounded-full px-3 py-1 text-sm">Voice: {book.persona}</div>

            <div className="vapi-status-indicator bg-white rounded-full px-3 py-1 text-sm">0:00/15:00</div>
          </div>
        </div>
      </div>

      <div className="transcript-container min-h-[400px]">
        <div className="transcript-empty">
          <Mic className="size-12 text-[#212a3b] mb-4" />
          <h2 className="transcript-empty-text">No conversation yet</h2>
          <p className="transcript-empty-hint">Click the mic button above to start talking</p>
        </div>
      </div>
    </div>
  );
};

export default VapiControls;
