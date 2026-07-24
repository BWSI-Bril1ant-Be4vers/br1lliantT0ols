import { Card, CardContent } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { forensicsFindings, pngChunks } from '../data/mock';

const hexLines = [
  '00000000  89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52  |.PNG........IHDR|',
  '00000010  00 00 07 80 00 00 04 38 08 06 00 00 00 e2 03 df  |.......8........|',
  '00000020  4f 00 00 00 09 70 48 59 73 00 00 0e c4 00 00 0e  |O....pHYs.......|',
  '00000030  c4 01 95 2b 0e 1b 00 00 8a 21 49 44 41 54 78 9c  |...+.....!IDATx.|',
  '00000040  50 4b 03 04 14 00 00 00 08 00 8a 8f 4b 5a 00 00  |PK..........KZ..|',
];

export function Forensics() {
  return (
    <div className="p-6 max-w-[1200px]">
      <Card>
        <Tabs tabs={['Metadata', 'Hex', 'Strings', 'EXIF', 'PNG Chunks', 'Entropy', 'Timeline']}>
          {(active) => (
            <CardContent>
              {active === 'Metadata' && (
                <div className="divide-y divide-line-soft">
                  {forensicsFindings.map((f) => (
                    <div key={f.label} className="flex items-start gap-4 py-2.5">
                      <span className="w-36 shrink-0 text-[11px] text-fog-dim uppercase tracking-wide font-mono pt-0.5">{f.label}</span>
                      <span className="text-[13px] font-mono text-paper">{f.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {active === 'Hex' && (
                <div className="rounded-lg bg-ink border border-line-soft p-4 overflow-x-auto">
                  <pre className="text-[11px] font-mono text-fog leading-relaxed">
                    {hexLines.map((l, i) => (
                      <div key={i} className={l.includes('8a 21') ? 'text-amber' : ''}>{l}</div>
                    ))}
                  </pre>
                </div>
              )}

              {active === 'Strings' && (
                <div className="space-y-1 font-mono text-[12px]">
                  {['libpng version 1.6.37', 'GIMP 2.10', 'CreationTime: 2026-06-14T09:12:00Z', 'PK\\x03\\x04', 'hidden_flag.txt', 'password_do_not_share'].map((s, i) => (
                    <div key={i} className={`px-2 py-1 rounded ${i >= 3 ? 'bg-amber/10 text-amber' : 'text-fog'}`}>{s}</div>
                  ))}
                </div>
              )}

              {active === 'EXIF' && (
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-[12px] font-mono">
                  {[['Make', 'Canon'], ['Model', 'EOS 5D Mark IV'], ['Software', 'GIMP 2.10'], ['DateTime', '2026:06:14 09:12:00'], ['GPS Latitude', '37.7749° N'], ['GPS Longitude', '122.4194° W'], ['Comment', 'nothing to see here']].map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-line-soft py-1.5">
                      <span className="text-fog-dim">{k}</span><span className="text-paper">{v}</span>
                    </div>
                  ))}
                </div>
              )}

              {active === 'PNG Chunks' && (
                <div className="space-y-1.5">
                  {pngChunks.map((c) => (
                    <div key={c.type} className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-surface-hover text-[12px] font-mono">
                      <Badge tone={c.type === 'tEXt' || c.type === 'zTXt' ? 'amber' : 'default'}>{c.type}</Badge>
                      <span className="text-fog-dim w-20">{c.offset}</span>
                      <span className="text-fog-dim w-20">{c.size}</span>
                      <span className="text-fog">{c.note}</span>
                    </div>
                  ))}
                </div>
              )}

              {active === 'Entropy' && (
                <div>
                  <div className="h-24 flex items-end gap-0.5">
                    {Array.from({ length: 64 }).map((_, i) => {
                      const h = 20 + Math.abs(Math.sin(i * 0.4)) * 70 + (i > 50 ? 20 : 0);
                      return <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: i > 50 ? '#e0a458' : '#5b8def' }} />;
                    })}
                  </div>
                  <p className="text-[11px] text-fog-dim mt-3 font-mono">Spike at offset 0x8A00–0x8FFF suggests embedded compressed/encrypted data.</p>
                </div>
              )}

              {active === 'Timeline' && (
                <div className="space-y-4 pl-3 border-l border-line-soft">
                  {[
                    ['09:12:00', 'File created — GIMP 2.10'],
                    ['09:14:22', 'Metadata modified'],
                    ['14:03:11', 'File uploaded to workspace'],
                    ['14:03:14', 'Entropy scan flagged offset 0x8A21'],
                  ].map(([t, d]) => (
                    <div key={t} className="relative pl-4">
                      <span className="absolute -left-[1.05rem] top-1 w-2 h-2 rounded-full bg-signal" />
                      <p className="text-[11px] font-mono text-fog-dim">{t}</p>
                      <p className="text-[13px]">{d}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          )}
        </Tabs>
      </Card>
    </div>
  );
}
