"use client";

import { EmptyState } from "@/components/ui";
import { Landmark, Activity } from "lucide-react";

export function SvgBarChart({ data, empty }: { data: any; empty?: boolean }) {
  if (empty || !data?.labels?.length) return <EmptyState text="Belum ada data" icon={Landmark} />;
  const max = Math.max(...data.datasets[0].data);
  const colors = ["#2b59ff", "#23c677", "#ffc829", "#8b5cf6", "#ff4d3d", "#0cc0df", "#ff7a1a", "#16161a"];
  return (
    <div className="flex items-end gap-2 h-full px-2">
      {data.labels.map((label: string, i: number) => {
        const val = data.datasets[0].data[i];
        const h = max > 0 ? (val / max) * 100 : 0;
        return (
          <div key={label} className="flex-1 flex flex-col items-center gap-1 min-w-0">
            <span className="text-xs font-bold text-muted">{val}</span>
            <div className="w-full max-w-[42px] border-[3px] border-ink" style={{ height: `${h}%`, backgroundColor: colors[i % colors.length] }} />
            <span className="text-[0.6rem] font-bold text-muted truncate w-full text-center">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

export function SvgDoughnutChart({ data, empty }: { data: any; empty?: boolean }) {
  if (empty || !data?.labels?.length) return <EmptyState text="Belum ada data" icon={Activity} />;
  const total = data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
  const colors = data.labels.map((l: string) => l === 'Baik' ? '#23c677' : l === 'Rusak' ? '#ff4d3d' : '#ffc829');
  let cumulative = 0;
  const segments = data.datasets[0].data.map((val: number, i: number) => {
    const pct = total > 0 ? (val / total) * 100 : 0;
    const start = cumulative;
    cumulative += pct;
    return { pct, color: colors[i], label: data.labels[i], val, start };
  });
  const R = 40, C = 50;
  const polar = (angle: number) => ({ x: C + R * Math.cos(angle * Math.PI / 180), y: C + R * Math.sin(angle * Math.PI / 180) });
  const arc = (start: number, end: number) => {
    const s = polar(start), e = polar(end);
    const large = end - start > 180 ? 1 : 0;
    return `M ${C} ${C} L ${s.x} ${s.y} A ${R} ${R} 0 ${large} 1 ${e.x} ${e.y} Z`;
  };
  return (
    <div className="flex flex-col items-center gap-2 h-full justify-center">
      <svg viewBox="0 0 100 100" className="w-32 h-32">
        {segments.map((seg: any, i: number) => seg.pct > 0 ? (
          <path key={i} d={arc(segments.slice(0, i).reduce((a: number, s: any) => a + s.pct, 0), segments.slice(0, i + 1).reduce((a: number, s: any) => a + s.pct, 0))} fill={seg.color} stroke="#16161a" strokeWidth="1" />
        ) : null)}
      </svg>
      <div className="flex gap-3 flex-wrap justify-center">
        {data.labels.map((l: string, i: number) => (
          <span key={l} className="flex items-center gap-1 text-xs font-bold text-muted uppercase">
            <span className="w-3 h-3 border-2 border-ink" style={{ backgroundColor: colors[i] }} />
            {l} ({total > 0 ? ((data.datasets[0].data[i] / total) * 100).toFixed(0) : 0}%)
          </span>
        ))}
      </div>
    </div>
  );
}
