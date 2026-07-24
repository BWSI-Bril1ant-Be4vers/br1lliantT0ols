import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { Card, CardHeader, CardTitle, CardSubtitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  weeklyActivity, categoryBreakdown, recentAnalyses, favoriteTools,
  aiSuggestions, recentlySolved, pinnedNotes,
} from '../data/mock';
import { Sparkles, Star, FileText, Trophy, StickyNote, TrendingUp } from 'lucide-react';
import { WorkbenchGraph } from '../components/WorkbenchGraph';

function StatCard({ label, value, delta, icon: Icon }: { label: string; value: string; delta: string; icon: typeof TrendingUp }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] text-fog-dim">{label}</p>
          <p className="text-2xl font-semibold mt-1 tracking-tight">{value}</p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-signal/10 flex items-center justify-center">
          <Icon size={15} className="text-signal" />
        </div>
      </div>
      <p className="text-[11px] text-mint mt-2 font-mono">{delta}</p>
    </Card>
  );
}

export function Dashboard() {
  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Analyses this week" value="49" delta="+18% vs last week" icon={TrendingUp} />
        <StatCard label="Challenges solved" value="127" delta="+6 this week" icon={Trophy} />
        <StatCard label="Active workspaces" value="4" delta="1 pending review" icon={FileText} />
        <StatCard label="Plugin uses" value="892" delta="+112 this week" icon={Sparkles} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Weekly analysis volume</CardTitle>
              <CardSubtitle>Files & artifacts processed across all modules</CardSubtitle>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={weeklyActivity} margin={{ left: -20 }}>
                <defs>
                  <linearGradient id="fillA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5b8def" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#5b8def" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fill: '#8890a2', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#171b23', border: '1px solid #232733', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="analyses" stroke="#5b8def" strokeWidth={2} fill="url(#fillA)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category breakdown</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <ResponsiveContainer width={110} height={110}>
              <PieChart>
                <Pie data={categoryBreakdown} dataKey="value" innerRadius={32} outerRadius={50} paddingAngle={3}>
                  {categoryBreakdown.map((c) => (
                    <Cell key={c.name} fill={c.color} stroke="none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5">
              {categoryBreakdown.map((c) => (
                <div key={c.name} className="flex items-center gap-2 text-[11px]">
                  <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                  <span className="text-fog">{c.name}</span>
                  <span className="text-fog-dim font-mono ml-auto">{c.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Recent analyses</CardTitle>
              <CardSubtitle>Latest files run through the Smart Analyzer</CardSubtitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-line-soft">
              {recentAnalyses.map((a) => (
                <div key={a.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-[13px] font-medium font-mono">{a.name}</p>
                    <p className="text-[11px] text-fog-dim mt-0.5">{a.type}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge tone={a.tone}>{a.result}</Badge>
                    <span className="text-[11px] text-fog-dim w-14 text-right">{a.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-signal" />
              <CardTitle>AI suggestions</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {aiSuggestions.map((s, i) => (
              <div key={i} className="text-[12px] text-fog leading-relaxed border-l-2 border-signal-dim pl-3">
                {s}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Workbench — artifact chain</CardTitle>
              <CardSubtitle>How each discovered artifact was derived, most recent case</CardSubtitle>
            </div>
          </CardHeader>
          <CardContent>
            <WorkbenchGraph />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Star size={13} className="text-amber" />
                <CardTitle>Favorite tools</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {favoriteTools.slice(0, 4).map((t) => (
                <div key={t.name} className="flex items-center justify-between text-[12px]">
                  <span className="text-paper">{t.name}</span>
                  <span className="text-fog-dim font-mono">{t.uses}×</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Trophy size={13} className="text-mint" />
                <CardTitle>Recently solved</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentlySolved.map((r) => (
                <div key={r.name} className="flex items-center justify-between text-[12px]">
                  <span className="text-paper">{r.name}</span>
                  <span className="text-fog-dim font-mono">{r.points} pts</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <StickyNote size={13} className="text-fog" />
            <CardTitle>Pinned notes</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          {pinnedNotes.map((n) => (
            <div key={n.title} className="rounded-lg border border-line-soft p-3 hover:border-line transition-colors cursor-pointer">
              <p className="text-[12px] font-medium">{n.title}</p>
              <p className="text-[11px] text-fog-dim mt-1">Updated {n.updated}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
