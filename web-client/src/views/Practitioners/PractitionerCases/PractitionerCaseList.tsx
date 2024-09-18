import React from 'react';

export function PractitionerCaseList({
  cases,
  showStatus,
}: {
  cases: any;
  showStatus: boolean;
}) {
  return (
    <>
      <table
        aria-label="Open Cases"
        className="usa-table ustc-table trial-sessions subsection"
        id={'practitioner-open-cases-table'}
      >
        <thead>
          <tr>
            <th>Docket No.</th>
            <th>Case Title</th>
            {showStatus && <th>Case Status</th>}
          </tr>
        </thead>
        {cases.map(item => (
          <tr key={item.pk}>
            <td>
              <a
                className="case-link"
                href={`/case-detail/${item.docketNumber}`}
              >
                {item.docketNumberWithSuffix}
              </a>
            </td>
            <td>{`${item.caseTitle}`}</td>
            {showStatus && <td>{`${item.status}`}</td>}
          </tr>
        ))}
      </table>
    </>
  );
}
