import clsx from "clsx";

export function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent?: "signal" | "orbit" | "thrive" | "default";
}) {
  const accentClass = {
    signal: "text-signal-400",
    orbit: "text-orbit-400",
    thrive: "text-thrive-400",
    default: "text-ink-100",
  }[accent ?? "default"];

  return (
    <div className="rounded-lg border border-line-700 bg-panel-800 px-4 py-3.5">
      <p className="text-[12.5px] text-ink-500">{label}</p>
      <p className={clsx("font-tabular mt-1 font-display text-[26px]", accentClass)}>
        {value}
      </p>
    </div>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-hull-900">
      <div
        className="h-full rounded-full bg-signal-500 transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
