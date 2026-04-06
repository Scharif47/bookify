"use client";

function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6 rounded-2xl bg-white px-12 py-10 shadow-xl max-w-sm w-full mx-4">
        <svg
          className="animate-spin"
          width="52"
          height="52"
          viewBox="0 0 52 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="26"
            cy="26"
            r="22"
            stroke="#5c3d2e"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="100 38"
          />
        </svg>

        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-2xl font-bold text-[#212a3b]">Synthesizing Your Book</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Please wait while we process your Upload and prepare your interactive literary experience.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoadingOverlay;
