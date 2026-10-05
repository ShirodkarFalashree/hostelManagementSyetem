import React from "react";
import { Loader2 } from "lucide-react";

export default function Loader({ text = "Loading details...", fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-xs">
        <Loader2 className="h-10 w-10 animate-spin text-slate-800" />
        {text && <p className="mt-3 text-sm font-medium text-slate-600">{text}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
      {text && <p className="mt-2 text-sm font-medium text-slate-500">{text}</p>}
    </div>
  );
}
