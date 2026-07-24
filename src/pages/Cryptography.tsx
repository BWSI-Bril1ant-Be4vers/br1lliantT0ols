tsx
import { useState, useMemo, type ChangeEvent } from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardSubtitle, CardContent } from '../components/ui/Card';
import { Textarea, Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { History } from 'lucide-react';

const algorithms = ['Caesar', 'Vigenère', 'XOR', 'Base64', 'ROT13', 'RSA (small n)'] as const;
type Algo = (typeof algorithms)[number];

interface HistoryEntry {
  op: string;
  time: string;
}

interface FreqPoint {
  letter: string;
  freq: number;
  baseline: number;
}

// ---------- Cipher implementations ----------

function caesarShift(text: string, shift: number): string {
  return text.replace(/[a-zA-Z]/g, (ch) => {
    const base = ch <= 'Z' ? 65 : 97;
    return String.fromCharCode(((ch.charCodeAt(0) - base + shift) % 26 + 26) % 26 + base);
  });
}

function vigenere(text: string, key: string, decode: boolean): string {
  if (!key) return text;
  const k = key.replace(/[^a-zA-Z]/g, '');
  if (!k) return text;
  let ki = 0;
  return text.replace(/[a-zA-Z]/g, (ch) => {
    const base = ch <= 'Z' ? 65 : 97;
    const kch = k[ki % k.length].toLowerCase();
    const kshift = kch.charCodeAt(0) - 97;
    ki++;
    const shift = decode ? -kshift : kshift;
    return String.fromCharCode(((ch.charCodeAt(0) - base + shift) % 26 + 26) % 26 + base);
  });
}

function xorCipher(text: string, key: string): string {
  if (!key) return text;
  let out = '';
  for (let i = 0; i < text.length; i++) {
    out += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return out;
}

function base64(text: string, decode: boolean): string {
  try {
    return decode ? atob(text) : btoa(text);
  } catch {
    return '[invalid base64 input]';
  }
}

function rot13(text: string): string {
  return caesarShift(text, 13);
}

function runCipher(algo: Algo, input: string, key: string, decode: boolean): string {
  switch (algo) {
    case 'Caesar': {
      const shift = parseInt(key, 10);
      const s = Number.isFinite(shift) ? shift : 3;
      return caesarShift(input, decode ? -s : s);
    }
    case 'Vigenère':
      return vigenere(input, key, decode);
    case 'XOR':
      return xorCipher(input, key);
    case 'Base64':
      return base64(input, decode);
    case 'ROT13':
      return rot13(input);
    case 'RSA (small n)':
      return '[RSA needs a private key/factorization step — see panel]';
    default:
      return input;
  }
}

// English letter frequency baseline (%) for comparison
const ENGLISH_FREQ: Record<string, number> = {
  a: 8.2, b: 1.5, c: 2.8, d: 4.3, e: 12.7, f: 2.2, g: 2.0, h: 6.1, i: 7.0,
  j: 0.2, k: 0.8, l: 4.0, m: 2.4, n: 6.7, o: 7.5, p: 1.9, q: 0.1, r: 6.0,
  s: 6.3, t: 9.1, u: 2.8, v: 1.0, w: 2.4, x: 0.2, y: 2.0, z: 0.1,
};

function computeFreq(text: string): FreqPoint[] {
  const counts: Record<string, number> = {};
  let total = 0;
  for (const ch of text.toLowerCase()) {
    if (ch >= 'a' && ch <= 'z') {
      counts[ch] = (counts[ch] || 0) + 1;
      total++;
    }
  }
  return Object.keys(ENGLISH_FREQ).map((letter) => ({
    letter,
    freq: total ? +(((counts[letter] || 0) / total) * 100).toFixed(1) : 0,
    baseline: ENGLISH_FREQ[letter],
  }));
}

export function Cryptography() {
  const [algo, setAlgo] = useState<Algo>('Vigenère');
  const [input, setInput] = useState<string>('Wkh iodj lv fdhvdu_lv_hdvb_420');
  const [key, setKey] = useState<string>('shadow');
  const [decode, setDecode] = useState<boolean>(true);
  const [output, setOutput] = useState<string>('the flag is caesar_is_easy_420');
  const [history, setHistory] = useState<HistoryEntry[]>([
    { op: 'Vigenère decode (key: shadow)', time: 'just now' },
    { op: 'Base64 decode', time: '6m ago' },
    { op: 'XOR brute-force, key len 3', time: '14m ago' },
  ]);

  const freqData = useMemo(() => computeFreq(input), [input]);

  function handleRun() {
    const result = runCipher(algo, input, key, decode);
    setOutput(result);

    const label = `${algo} ${decode ? 'decode' : 'encode'}${key ? ` (key: ${key})` : ''}`;
    setHistory((h) => [{ op: label, time: 'just now' }, ...h].slice(0, 8));
  }

  const needsKey = algo === 'Vigenère' || algo === 'XOR' || algo === 'Caesar';
  const hasDirection = algo === 'Caesar' || algo === 'Vigenère' || algo === 'Base64';

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
              value={input}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
              className="text-xs"
            />
            <div className="flex items-center gap-2 mt-3">
              {needsKey && (
                <Input
                  placeholder={algo === 'Caesar' ? 'Shift (e.g. 3)' : 'Key (optional)'}
                  value={key}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setKey(e.target.value)}
                  className="h-8 flex-1 text-xs font-mono"
                />
              )}
              {hasDirection && (
                <button
                  onClick={() => setDecode((d) => !d)}
                  className="h-8 px-2.5 rounded-lg border border-line text-[11px] font-mono text-fog hover:text-paper"
                >
                  {decode ? 'Decode' : 'Encode'}
                </button>
              )}
              <Button variant="primary" size="sm" onClick={handleRun}>Run {algo}</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Output</CardTitle>
            <Badge tone="mint">{decode ? 'decoded' : 'encoded'}</Badge>
          </CardHeader>
          <CardContent>
            <pre className="text-xs font-mono text-mint leading-relaxed whitespace-pre-wrap">
{output}
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
                <BarChart data={freqData} margin={{ left: -25 }}>
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
              <p className="text-[11px] text-fog-dim mt-2 font-mono">
                {algo === 'XOR' && key ? `key = "${key}" · repeating, length ${key.length}` : 'key = 0x5A · repeating, length 1'}
              </p>
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
            {history.map((h, i) => (
              <div key={`${h.op}-${i}`} className="flex items-center justify-between text-[12px]">
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
