import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';
import { ScoreBadge } from './ScoreBadge';
import { ReasoningCell } from './ReasoningCell';
import type { ResumeStatus } from '@/types';

interface ResultItem {
  id: string;
  originalFilename: string;
  status: ResumeStatus;
  score: number | null;
  reasoning: string | null;
}

export function ResultsTable({ resumes }: { resumes: ResultItem[] }) {
  if (resumes.length === 0) {
    return <div className="text-center p-8 text-gray-500">No resumes found.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Candidate File</TableHead>
          <TableHead className="w-[100px] text-center">Score</TableHead>
          <TableHead>AI Match Reasoning</TableHead>
          <TableHead className="w-[100px]">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {resumes.map((resume) => (
          <TableRow key={resume.id}>
            <TableCell className="font-medium text-gray-900 border-r border-gray-100">{resume.originalFilename}</TableCell>
            <TableCell className="text-center align-top border-r border-gray-100">
              <ScoreBadge score={resume.score} />
            </TableCell>
            <TableCell className="align-top border-r border-gray-100">
              <ReasoningCell reasoning={resume.reasoning} />
            </TableCell>
            <TableCell className="align-top">
              <span className="capitalize text-xs text-gray-500">{resume.status}</span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
