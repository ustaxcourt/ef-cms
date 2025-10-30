import React from 'react';
import { isLeadCase } from '@shared/business/entities/cases/Case';

export function ConsolidatedCaseGroupInfo({
  option,
  docketNumber,
  leadDocketNumber,
  consolidatedCaseDeadlines,
}: {
  option: 'add' | 'edit' | 'delete';
  docketNumber?: string;
  leadDocketNumber?: string;
  consolidatedCaseDeadlines: {
    docketNumber: string;
    caseCaption: string;
  }[];
}) {
  if (docketNumber && leadDocketNumber && !isLeadCase({ docketNumber, leadDocketNumber })) return;
  if (consolidatedCaseDeadlines.length < 2) return;

  const TEXT_DICT = {
    add: 'This deadline will be added to all cases in the consolidated group.',
    edit: 'This deadline will be edited for all cases in the consolidated group.',
    delete:
      'This deadline will be deleted from all cases in the consolidated group.',
  } as const;

  return (
    <div
      className={`margin-bottom-3 ${option === 'delete' ? 'margin-top-3' : ''}`}
    >
      <h4>This case is part of a consolidated group.</h4>
      <p>{TEXT_DICT[option]}</p>
      {consolidatedCaseDeadlines.map(({ docketNumber, caseCaption }) => {
        return (
          <p key={docketNumber}>
            {docketNumber} {caseCaption}
          </p>
        );
      })}
    </div>
  );
}
