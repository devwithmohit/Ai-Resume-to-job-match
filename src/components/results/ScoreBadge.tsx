import React from 'react';

export function ScoreBadge({ score }: { score: number | null }) {
  if (score === null || score === undefined) {
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Pending</span>;
  }

  let color = 'bg-red-100 text-red-800'; // 0-24 Poor
  if (score >= 90) color = 'bg-green-100 text-green-800'; // 90-100 Excellent
  else if (score >= 70) color = 'bg-blue-100 text-blue-800'; // 70-89 Strong
  else if (score >= 50) color = 'bg-amber-100 text-amber-800'; // 50-69 Partial
  else if (score >= 25) color = 'bg-orange-100 text-orange-800'; // 25-49 Weak

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${color}`}>
      {score}/100
    </span>
  );
}
