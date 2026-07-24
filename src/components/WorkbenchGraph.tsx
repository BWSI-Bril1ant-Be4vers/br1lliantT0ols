import { workbenchGraph } from '../data/mock';
import { File, Image, Archive, Cpu, Flag } from 'lucide-react';

const kindStyle: Record<string, { icon: typeof File; color: string }> = {
  file: { icon: File, color: '#5b8def' },
  image: { icon: Image, color: '#47c9d6' },
  archive: { icon: Archive, color: '#e0a458' },
  binary: { icon: Cpu, color: '#e0637a' },
  flag: { icon: Flag, color: '#5fc98a' },
};

export function WorkbenchGraph() {
  const { nodes, edges } = workbenchGraph;
  const find = (id: string) => nodes.find((n) => n.id === id)!;

  return (
    <svg viewBox="0 0 560 400" className="w-full h-[280px]">
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#3a5789" />
        </marker>
      </defs>
      {edges.map(([a, b], i) => {
        const n1 = find(a);
        const n2 = find(b);
        return (
          <line
            key={i}
            x1={n1.x + 46}
            y1={n1.y + 18}
            x2={n2.x}
            y2={n2.y + 18}
            stroke="#3a5789"
            strokeWidth={1.5}
            strokeDasharray="4 3"
            markerEnd="url(#arrow)"
          />
        );
      })}
      {nodes.map((n) => {
        const { icon: Icon, color } = kindStyle[n.kind];
        return (
          <g key={n.id} transform={`translate(${n.x}, ${n.y})`} className="cursor-pointer">
            <rect
              width={140}
              height={36}
              rx={10}
              fill="#171b23"
              stroke={color}
              strokeOpacity={0.5}
              strokeWidth={1.2}
            />
            <foreignObject x={0} y={0} width={140} height={36}>
              <div className="flex items-center gap-2 h-full px-2.5">
                <Icon size={13} color={color} />
                <span className="text-[11px] font-mono text-paper truncate">{n.label}</span>
              </div>
            </foreignObject>
          </g>
        );
      })}
    </svg>
  );
}
