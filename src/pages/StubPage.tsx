import type { LucideIcon } from "lucide-react";

interface StubPageProps {
  icon: LucideIcon;
  title: string;
  description?: string;
}

export function StubPage({ icon: Icon, title, description }: StubPageProps) {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[70vh]">
      <div className="flex flex-col items-center text-center gap-3 max-w-sm">
        <div className="w-12 h-12 rounded-xl bg-signal/12 border border-signal-dim/60 flex items-center justify-center">
          <Icon size={22} className="text-signal" strokeWidth={2} />
        </div>
        <h2 className="text-base font-semibold text-paper">{title}</h2>
        <p className="text-sm text-fog">Coming soon!</p>
        {description && (
          <p className="text-xs text-fog-dim">{description}</p>
        )}
      </div>
    </div>
  );
}
