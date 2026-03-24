import React from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';

/**
 * Standard content text block skeleton mirroring UI_UX_SPEC configuration
 */
export function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4 h-full w-full">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
}

/**
 * Orchestrates a shimmering table view mirroring the Results Dashboard layout mappings
 */
export function ResultsTableSkeleton() {
  return (
    <Card className="overflow-hidden shadow-sm">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-200">
          {[1, 2, 3, 4, 5].map((i) => (
             <div key={i} className="p-4 flex items-center space-x-4 animate-pulse">
               <div className="flex-1 space-y-2">
                 <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                 <div className="h-3 bg-gray-200 rounded w-1/2"></div>
               </div>
               <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
             </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
