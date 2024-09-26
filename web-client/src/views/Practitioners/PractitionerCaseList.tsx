import { CaseLink } from '@web-client/ustc-ui/CaseLink/CaseLink';
import { PractitionerCaseIcons } from './PractitionerCaseIcons';
import React from 'react';

const getEmptyStateText = (isOpen: boolean) => {
  return `There are no ${isOpen ? 'open' : 'closed'} cases.`;
};

export function PractitionerCaseList({
  cases,
  caseType,
  id,
}: {
  cases: any;
  caseType: 'open' | 'closed';
  id: string;
}) {
  const showStatus = caseType === 'open';
  return (
    <>
      <div
        className="margin-top-1"
        data-testid={`${id}-container`}
        id={`${id}-container`}
      >
        {cases.length > 0 ? (
          <table
            aria-label="Open Cases"
            className="usa-table ustc-table"
            data-testid={id}
            id={id}
          >
            <thead>
              <tr>
                <th aria-hidden="true" className="icon-column" />
                <th>Docket No.</th>
                <th>Case Title</th>
                {showStatus && <th>Case Status</th>}
              </tr>
            </thead>
            {cases.map(item => (
              <tr key={item.docketNumberWithSuffix}>
                <td aria-hidden="true">
                  <PractitionerCaseIcons formattedCase={item} />
                </td>
                <td>
                  <CaseLink formattedCase={item} />
                </td>
                <td>{`${item.caseTitle}`}</td>
                {showStatus && <td>{`${item.status}`}</td>}
              </tr>
            ))}
          </table>
        ) : (
          getEmptyStateText(showStatus)
        )}
      </div>
    </>
  );
}
