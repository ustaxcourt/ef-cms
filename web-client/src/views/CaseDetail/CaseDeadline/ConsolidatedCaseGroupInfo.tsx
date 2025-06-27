import React from 'react';

export function ConsolidatedCaseGroupInfo({
  option,
  docketNumber,
  leadDocketNumber,
  consolidatedCases,
}: {
  option: 'add' | 'edit' | 'delete';
  docketNumber: string;
  leadDocketNumber: string | undefined;
  consolidatedCases: {
    docketNumber: string;
    caseCaption: string;
  }[];
}) {
  const isLeadCase = docketNumber === leadDocketNumber;
  if (!isLeadCase) return;
  if (!consolidatedCases.length) return;

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
      {consolidatedCases.map(({ docketNumber, caseCaption }) => {
        return (
          <p key={docketNumber}>
            {docketNumber} {caseCaption}
          </p>
        );
      })}
    </div>
  );
}
