import type { LucideIcon } from 'lucide-react';

export function StubPage({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <div className="p-6 flex items-center justify-center h-[calc(100vh-3.5rem)]">
      <div className="max-w-sm text-center">
        <div className="w-14 h-14 rounded-2xl bg-signal/10 flex items-center justify-center mx-auto mb-4">
          <Icon size={22} className="text-signal" />
        </div>
        <h2 className="text-sm font-semibold">{title}</h2>
        <p className="text-[13px] text-fog-dim mt-2 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
