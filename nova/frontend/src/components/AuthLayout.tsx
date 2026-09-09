import type { ReactNode } from "react";
import { Radio } from "lucide-react";

export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-hull-950 px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-10%] h-[520px] w-[720px] -translate-x-1/2 rounded-full opacity-30 blur-[110px]"
        style={{
          background:
            "radial-gradient(closest-side, #e8a33d, transparent 70%)",
        }}
      />
      <div className="relative w-full max-w-[400px]">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <Radio size={22} className="text-signal-500" strokeWidth={2.25} />
            <span className="font-display text-[24px] text-ink-100">NOVA</span>
          </div>
          <div>
            <h1 className="font-display text-[22px] text-ink-100">{title}</h1>
            <p className="mt-1 text-[13.5px] text-ink-500">{subtitle}</p>
          </div>
        </div>

        <div className="rounded-lg border border-line-700 bg-panel-800 p-6">
          {children}
        </div>

        <p className="mt-5 text-center text-[13px] text-ink-500">{footer}</p>
      </div>
    </div>
  );
}
