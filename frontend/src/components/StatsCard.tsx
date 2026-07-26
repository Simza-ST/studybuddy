import React from 'react';

interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number;
  trend?: { direction: 'up' | 'down'; percentage: number };
  color?: 'blue' | 'emerald' | 'orange' | 'purple' | 'pink';
  subtitle?: string;
}

const colorClasses = {
  blue: 'bg-blue-50 border-blue-200',
  emerald: 'bg-emerald-50 border-emerald-200',
  orange: 'bg-orange-50 border-orange-200',
  purple: 'bg-purple-50 border-purple-200',
  pink: 'bg-pink-50 border-pink-200',
};

const textColorClasses = {
  blue: 'text-blue-600',
  emerald: 'text-emerald-600',
  orange: 'text-orange-600',
  purple: 'text-purple-600',
  pink: 'text-pink-600',
};

const iconBgClasses = {
  blue: 'bg-blue-100',
  emerald: 'bg-emerald-100',
  orange: 'bg-orange-100',
  purple: 'bg-purple-100',
  pink: 'bg-pink-100',
};

export default function StatsCard({
  icon,
  label,
  value,
  trend,
  color = 'blue',
  subtitle,
}: StatsCardProps) {
  return (
    <div className={`rounded-2xl border p-6 transition-all hover:shadow-md ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className={`${iconBgClasses[color]} w-fit rounded-lg p-3 mb-4`}>
            <span className="text-xl">{icon}</span>
          </div>
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p className={`mt-3 text-3xl font-bold ${textColorClasses[color]}`}>{value}</p>
          {subtitle && <p className="mt-2 text-xs text-slate-500">{subtitle}</p>}
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${
              trend.direction === 'up'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            <span>{trend.direction === 'up' ? '↑' : '↓'}</span>
            <span>{trend.percentage}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
