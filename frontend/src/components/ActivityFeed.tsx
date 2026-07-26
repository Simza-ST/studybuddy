import React from 'react';

interface ActivityItem {
  id: string;
  type: 'quiz' | 'upload' | 'achievement' | 'milestone';
  title: string;
  description: string;
  timestamp: Date;
  icon: string;
  color: 'blue' | 'emerald' | 'orange' | 'purple' | 'pink';
}

const colorClasses = {
  blue: 'bg-blue-100 text-blue-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  orange: 'bg-orange-100 text-orange-700',
  purple: 'bg-purple-100 text-purple-700',
  pink: 'bg-pink-100 text-pink-700',
};

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  limit?: number;
}

export default function ActivityFeed({ activities, limit = 5 }: ActivityFeedProps) {
  return (
    <div className="space-y-4">
      {activities.slice(0, limit).map((activity) => (
        <div
          key={activity.id}
          className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:shadow-sm"
        >
          <div className={`rounded-lg p-3 flex-shrink-0 ${colorClasses[activity.color]}`}>
            <span className="text-lg">{activity.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-semibold text-slate-900">{activity.title}</p>
                <p className="mt-1 text-sm text-slate-600">{activity.description}</p>
              </div>
              <span className="ml-2 text-xs text-slate-500 flex-shrink-0 whitespace-nowrap">
                {formatTime(activity.timestamp)}
              </span>
            </div>
          </div>
        </div>
      ))}
      {activities.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <p className="text-sm text-slate-500">No recent activity</p>
        </div>
      )}
    </div>
  );
}
