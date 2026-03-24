'use client';

import React, { useState } from 'react';

export function ReasoningCell({ reasoning }: { reasoning?: string | null }) {
  const [expanded, setExpanded] = useState(false);

  if (!reasoning) return <span className="text-gray-400 italic">No reasoning provided.</span>;

  const truncateLen = 100;
  const isLong = reasoning.length > truncateLen;
  const displayContent = expanded || !isLong ? reasoning : `${reasoning.substring(0, truncateLen)}...`;

  return (
    <div className="text-sm text-gray-600">
      <p className="whitespace-pre-wrap">{displayContent}</p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-600 hover:text-blue-800 mt-1 font-medium text-xs focus-visible:outline-blue-500"
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  );
}
