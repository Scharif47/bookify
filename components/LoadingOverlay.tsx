"use client";

function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black">Uploading...</div>
    </div>
  );
}

export default LoadingOverlay;
