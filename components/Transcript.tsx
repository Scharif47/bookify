"use client";

import { useEffect, useRef } from "react";
import { Mic } from "lucide-react";

type Role = "user" | "assistant" | string;

type Message = {
  role: Role;
  content: string;
};

type TranscriptProps = {
  messages: Message[];
  currentMessage?: string; // streaming AI text
  currentUserMessage?: string; // streaming user text
};

export default function Transcript({ messages, currentMessage = "", currentUserMessage = "" }: TranscriptProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // Scroll to bottom smoothly when messages or streaming text change
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, currentMessage, currentUserMessage]);

  const isEmpty = messages.length === 0 && !currentMessage && !currentUserMessage;

  if (isEmpty) {
    return (
      <div className="transcript-container">
        <div className="transcript-empty" ref={containerRef}>
          <div className="flex flex-col items-center justify-center text-center py-8">
            <div className="bg-white rounded-full p-4 shadow mb-4">
              <Mic className="w-8 h-8 text-[#663820]" />
            </div>
            <div className="transcript-empty-text font-semibold text-lg">No conversation yet</div>
            <div className="transcript-empty-hint text-sm text-gray-600 mt-2">
              Start a new conversation by speaking or typing.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="transcript-container">
      <div className="transcript-messages" ref={containerRef}>
        {messages.map((m, idx) => {
          const isUser = m.role === "user";
          return (
            <div
              key={idx}
              className={`transcript-message ${isUser ? "transcript-message-user" : "transcript-message-assistant"} my-3 flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`transcript-bubble ${isUser ? "transcript-bubble-user" : "transcript-bubble-assistant"} max-w-[80%] p-4 rounded-lg`}
              >
                <div>{m.content}</div>
              </div>
            </div>
          );
        })}

        {currentMessage ? (
          <div className="transcript-message transcript-message-assistant my-3 flex justify-start">
            <div className="transcript-bubble transcript-bubble-assistant max-w-[80%] p-4 rounded-lg">
              <span>{currentMessage}</span>
              <span className="transcript-cursor ml-1 inline-block" />
            </div>
          </div>
        ) : null}

        {currentUserMessage ? (
          <div className="transcript-message transcript-message-user my-3 flex justify-end">
            <div className="transcript-bubble transcript-bubble-user max-w-[80%] p-4 rounded-lg text-white">
              <span>{currentUserMessage}</span>
              <span className="transcript-cursor ml-1 inline-block" />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
