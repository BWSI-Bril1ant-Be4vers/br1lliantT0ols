import { useState } from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardSubtitle, CardContent } from '../components/ui/Card';
import { Textarea } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { freqAnalysis } from '../data/mock';
import { History } from 'lucide-react';

const algorithms = ['Caesar', 'Vigenère', 'XOR', 'Base64', 'ROT13', 'RSA (small n)'];

const history = [
  { op: 'Vigenère decode (key: shadow)', time: '2m ago' },
  { op: 'Base64 decode', time: '6m ago' },
  { op: 'XOR brute-force, key len 3', time: '14m ago' },
];

export function Cryptography() {
  const [algo, setAlgo] = useState('Vigenère');

  return (
    <div className="p-6 grid grid-cols-3 gap-4 max-w-[1400px]">
      <div className="col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <div className="flex gap-1.5 flex-wrap">
              {algorithms.map((a) => (
                <button
                  key={a}
                  onClick={() => setAlgo(a)}
                  className={`text-[11px] px-2.5 py-1 rounded-full border font-mono transition-colors ${
                    algo === a ? 'border-signal-dim bg-signal/12 text-signal' : 'border-line text-fog hover:text-paper'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              rows={4}
              defaultValue="Wkh iodj lv fdhvdu_lv_hdvb_420"
              className="text-xs"
            />
            <div className="flex items-center gap-2 mt-3">
              <input
                placeholder="Key (optional)"
                className="h-8 flex-1 rounded-lg border border-line bg-surface-raised px-3 text-xs font-mono outline-none focus:border-signal"
                defaultValue="shadow"
              />
              <Button variant="primary" size="sm">Run {algo}</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Output</CardTitle>
            <Badge tone="mint">decoded</Badge>
          </CardHeader>
          <CardContent>
            <pre className="text-xs font-mono text-mint leading-relaxed whitespace-pre-wrap">
{`the flag is caesar_is_easy_420`}
            </pre>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequency analysis</CardTitle>
              <CardSubtitle>Letter distribution vs. English baseline</CardSubtitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={freqAnalysis} margin={{ left: -25 }}>
                  <XAxis dataKey="letter" tick={{ fill: '#8890a2', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#171b23', border: '1px solid #232733', borderRadius: 8, fontSize: 11 }} />
                  <Bar dataKey="freq" fill="#5b8def" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>XOR key overlay</CardTitle>
              <CardSubtitle>Byte-wise plaintext vs. cipher</CardSubtitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-8 gap-1">
                {Array.from({ length: 32 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-6 rounded"
                    style={{ background: `rgba(91,141,239,${0.15 + (i % 8) * 0.09})` }}
                  />
                ))}
              </div>
              <p className="text-[11px] text-fog-dim mt-2 font-mono">key = 0x5A · repeating, length 1</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <History size={13} className="text-fog" />
              <CardTitle>Transformation history</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {history.map((h) => (
              <div key={h.op} className="flex items-center justify-between text-[12px]">
                <span className="text-paper">{h.op}</span>
                <span className="text-fog-dim shrink-0 ml-2">{h.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>RSA parameters</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-[12px] font-mono">
            <div className="flex justify-between"><span className="text-fog-dim">n</span><span>0x9F3A...E271</span></div>
            <div className="flex justify-between"><span className="text-fog-dim">e</span><span>65537</span></div>
            <div className="flex justify-between"><span className="text-fog-dim">bits</span><span>512 (weak)</span></div>
            <Badge tone="amber" className="mt-1">factorable via Fermat</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
