import React from 'react';

interface PerformanceData {
  label: string;
  value: number;
  maxValue?: number;
  trend?: number;
}

interface PerformanceChartProps {
  title: string;
  data: PerformanceData[];
  subtitle?: string;
}

function SimpleBarChart({ data }: { data: PerformanceData[] }) {
  const maxValue = Math.max(...data.map((d) => d.maxValue || 100));

  return (
    <div className="space-y-4">
      {data.map((item, index) => {
        const percentage = (item.value / maxValue) * 100;
        const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-orange-500', 'bg-purple-500', 'bg-pink-500'];
        const color = colors[index % colors.length];

        return (
          <div key={item.label}>
            <div className="mb-2 flex items-center justify-between">
              <span className="font-medium text-slate-900">{item.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900">{item.value}</span>
                {item.trend !== undefined && (
                  <span
                    className={`text-xs font-medium ${
                      item.trend > 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {item.trend > 0 ? '↑' : '↓'} {Math.abs(item.trend)}%
                  </span>
                )}
              </div>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full transition-all ${color}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function PerformanceChart({
  title,
  data,
  subtitle,
}: PerformanceChartProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {subtitle && <p className="mt-2 text-sm text-slate-600">{subtitle}</p>}
      </div>
      <SimpleBarChart data={data} />
    </div>
  );
}
