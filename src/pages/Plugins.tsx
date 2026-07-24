import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { pluginList } from '../data/mock';
import { Star, Download, Blocks } from 'lucide-react';

export function Plugins() {
  return (
    <div className="p-6 max-w-[1100px]">
      <div className="grid grid-cols-2 gap-4">
        {pluginList.map((p) => (
          <Card key={p.name}>
            <CardContent>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-signal/10 flex items-center justify-center shrink-0">
                  <Blocks size={16} className="text-signal" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[13px] font-semibold">{p.name}</h3>
                  <p className="text-[12px] text-fog-dim mt-1 leading-relaxed">{p.desc}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3 text-[11px] text-fog-dim">
                      <span className="flex items-center gap-1"><Star size={11} className="text-amber" />{p.rating}</span>
                      <span className="flex items-center gap-1"><Download size={11} />{p.installs}</span>
                    </div>
                    <Button variant="outline" size="sm">Install</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
