import { CaseLink } from '@web-client/ustc-ui/CaseLink/CaseLink';
import { PractitionerCaseIcons } from './PractitionerCaseIcons';
import React from 'react';

const getEmptyStateText = (isOpen: boolean) => {
  return `There are no ${isOpen ? 'open' : 'closed'} cases.`;
};

export function PractitionerCaseList({
  cases,
  caseType,
}: {
  cases: any;
  caseType: 'open' | 'closed';
}) {
  const showStatus = caseType === 'open';
  const tableId = `practitioner-${caseType}-cases-list`;
  return (
    <>
      <div
        className="margin-top-1"
        data-testid={`${tableId}-container`}
        id={`${tableId}-container`}
      >
        {cases.length > 0 ? (
          <table
            aria-label="Open Cases"
            className="usa-table ustc-table"
            data-testid={tableId}
            id={tableId}
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
