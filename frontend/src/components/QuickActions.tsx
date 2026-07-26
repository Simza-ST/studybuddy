import React from 'react';
import { Link } from 'react-router-dom';

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  path: string;
  description: string;
  color: 'blue' | 'emerald' | 'orange' | 'purple' | 'pink';
}

const colorClasses = {
  blue: 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700',
  emerald: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700',
  orange: 'bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-700',
  purple: 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700',
  pink: 'bg-pink-50 hover:bg-pink-100 border-pink-200 text-pink-700',
};

interface QuickActionsProps {
  actions: QuickAction[];
}

export default function QuickActions({ actions }: QuickActionsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {actions.map((action) => (
        <Link
          key={action.id}
          to={action.path}
          className={`group rounded-2xl border p-6 transition-all ${colorClasses[action.color]}`}
        >
          <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">
            {action.icon}
          </div>
          <h3 className="font-semibold text-slate-900">{action.label}</h3>
          <p className="mt-2 text-sm text-slate-600">{action.description}</p>
          <div className="mt-4 flex items-center text-sm font-medium">
            <span>Get started</span>
            <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
