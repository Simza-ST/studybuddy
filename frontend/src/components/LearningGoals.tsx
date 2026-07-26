import React from 'react';

interface LearningGoal {
  id: string;
  title: string;
  progress: number;
  target: number;
  category: string;
  dueDate: Date;
  icon: string;
}

interface LearningGoalsProps {
  goals: LearningGoal[];
  onGoalClick?: (goalId: string) => void;
}

function getProgressColor(progress: number, target: number): string {
  const percentage = (progress / target) * 100;
  if (percentage >= 100) return 'bg-emerald-500';
  if (percentage >= 75) return 'bg-blue-500';
  if (percentage >= 50) return 'bg-orange-500';
  return 'bg-slate-300';
}

function getDaysUntilDue(dueDate: Date): { text: string; color: string } {
  const now = new Date();
  const diff = dueDate.getTime() - now.getTime();
  const days = Math.ceil(diff / 86400000);

  if (days < 0) return { text: 'Overdue', color: 'text-red-600' };
  if (days === 0) return { text: 'Due today', color: 'text-orange-600' };
  if (days === 1) return { text: 'Due tomorrow', color: 'text-orange-600' };
  return { text: `${days}d left`, color: 'text-slate-600' };
}

export default function LearningGoals({ goals, onGoalClick }: LearningGoalsProps) {
  return (
    <div className="space-y-4">
      {goals.length > 0 ? (
        goals.map((goal) => {
          const daysInfo = getDaysUntilDue(goal.dueDate);
          const percentage = (goal.progress / goal.target) * 100;

          return (
            <div
              key={goal.id}
              onClick={() => onGoalClick?.(goal.id)}
              className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{goal.icon}</span>
                  <div>
                    <p className="font-semibold text-slate-900">{goal.title}</p>
                    <p className="text-xs text-slate-500">{goal.category}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium ${daysInfo.color}`}>{daysInfo.text}</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">
                    Progress: {goal.progress} / {goal.target}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">{Math.round(percentage)}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full transition-all ${getProgressColor(goal.progress, goal.target)}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <p className="text-sm text-slate-500">No learning goals yet. Set one to get started!</p>
        </div>
      )}
    </div>
  );
}
