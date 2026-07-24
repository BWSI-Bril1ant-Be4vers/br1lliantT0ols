import { Card, CardContent } from '../components/ui/Card';
import { utilityCategories } from '../data/mock';
import { Wrench } from 'lucide-react';

export function Utilities() {
  return (
    <div className="p-6 max-w-[1400px]">
      <div className="grid grid-cols-3 gap-4">
        {utilityCategories.map((cat) => (
          <Card key={cat.name} className="hover:border-fog-dim/60 transition-colors">
            <CardContent>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-signal/10 flex items-center justify-center">
                  <Wrench size={13} className="text-signal" />
                </div>
                <h3 className="text-[13px] font-semibold">{cat.name}</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cat.tools.map((t) => (
                  <span key={t} className="text-[11px] font-mono px-2 py-1 rounded-md bg-surface-raised border border-line-soft text-fog hover:text-paper hover:border-line cursor-pointer transition-colors">
                    {t}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
