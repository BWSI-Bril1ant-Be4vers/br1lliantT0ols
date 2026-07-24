import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const disasm = [
  '0x401000  push   rbp',
  '0x401001  mov    rbp, rsp',
  '0x401004  sub    rsp, 0x20',
  '0x401008  mov    [rbp-0x4], edi',
  '0x40100b  cmp    dword [rbp-0x4], 0x2a',
  '0x40100f  jne    0x401030',
  '0x401011  lea    rdi, [rip+0x2f0e]  ; "correct key"',
  '0x401018  call   0x401120  <printf>',
];

const strings = ['correct key', 'access denied', 'libc.so.6', '/bin/sh', 'FLAG{r3v_m3_g3ntly}'];
const imports = ['printf', 'strcmp', 'malloc', 'ptrace', 'system'];

export function ReverseEngineering() {
  return (
    <div className="p-6 grid grid-cols-[220px_1fr_240px] gap-4 max-w-[1500px] h-[calc(100vh-3.5rem)]">
      <div className="space-y-4 overflow-y-auto scrollbar-thin">
        <Card>
          <div className="px-4 py-3 border-b border-line-soft text-[11px] font-semibold uppercase tracking-wide text-fog-dim">Binary structure</div>
          <div className="p-3 text-[12px] font-mono space-y-1">
            {['.text', '.data', '.rodata', '.bss', '.plt', '.got'].map((s) => (
              <div key={s} className="px-2 py-1.5 rounded hover:bg-surface-hover cursor-pointer text-fog">{s}</div>
            ))}
          </div>
        </Card>
        <Card>
          <div className="px-4 py-3 border-b border-line-soft text-[11px] font-semibold uppercase tracking-wide text-fog-dim">Import table</div>
          <div className="p-3 text-[12px] font-mono space-y-1">
            {imports.map((s) => <div key={s} className="px-2 py-1 text-cyan">{s}</div>)}
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-4 min-h-0">
        <Card className="flex-1 min-h-0 flex flex-col">
          <div className="px-4 py-3 border-b border-line-soft flex items-center justify-between">
            <span className="text-[12px] font-semibold">main.c — decompiled</span>
            <Badge tone="amber">not stripped</Badge>
          </div>
          <div className="p-4 overflow-y-auto scrollbar-thin flex-1 bg-ink">
            <pre className="text-[12px] font-mono text-fog leading-relaxed">
              {disasm.map((l, i) => (
                <div key={i} className={l.includes('printf') || l.includes('correct') ? 'text-amber' : ''}>{l}</div>
              ))}
            </pre>
          </div>
        </Card>
        <Card className="h-32">
          <div className="px-4 py-2 border-b border-line-soft text-[11px] font-semibold uppercase tracking-wide text-fog-dim">Console</div>
          <div className="p-3 text-[11px] font-mono text-mint">
            <div>$ ./binary 42</div>
            <div className="text-fog">correct key</div>
            <div className="text-fog-dim animate-pulse-dot">_</div>
          </div>
        </Card>
      </div>

      <div className="space-y-4 overflow-y-auto scrollbar-thin">
        <Card>
          <div className="px-4 py-3 border-b border-line-soft text-[11px] font-semibold uppercase tracking-wide text-fog-dim">Function info</div>
          <div className="p-3 text-[12px] space-y-1.5">
            <div className="flex justify-between"><span className="text-fog-dim">Name</span><span className="font-mono">main</span></div>
            <div className="flex justify-between"><span className="text-fog-dim">Address</span><span className="font-mono">0x401000</span></div>
            <div className="flex justify-between"><span className="text-fog-dim">Xrefs</span><span className="font-mono">3</span></div>
          </div>
        </Card>
        <Card>
          <div className="px-4 py-3 border-b border-line-soft text-[11px] font-semibold uppercase tracking-wide text-fog-dim">Strings</div>
          <div className="p-3 text-[11px] font-mono space-y-1">
            {strings.map((s) => (
              <div key={s} className={`px-2 py-1 rounded ${s.startsWith('FLAG') ? 'bg-mint/10 text-mint' : 'text-fog'}`}>{s}</div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
