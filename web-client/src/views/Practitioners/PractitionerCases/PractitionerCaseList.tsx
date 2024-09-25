import { CaseLink } from '@web-client/ustc-ui/CaseLink/CaseLink';
import { Icon } from '@web-client/ustc-ui/Icon/Icon';
import React from 'react';

const getEmptyStateText = (isOpen: boolean) => {
  return `There are no ${isOpen ? 'open' : 'closed'} cases.`;
};

export function PractitionerCaseList({
  cases,
  id,
  showStatus,
}: {
  cases: any;
  showStatus: boolean;
  id: string;
}) {
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
                <th aria-hidden="true" />
                <th>Docket No.</th>
                <th>Case Title</th>
                {showStatus && <th>Case Status</th>}
              </tr>
            </thead>
            {cases.map(item => (
              <tr key={item.pk}>
                <td aria-hidden="true" className="multi-filing-type-icon">
                  {item.isSealed && (
                    <Icon
                      aria-label={item.sealedToTooltip}
                      className="sealed-docket-entry"
                      icon="lock"
                      title={item.sealedToTooltip}
                    />
                  )}
                  {item.inConsolidatedGroup && (
                    <span
                      className="fa-layers fa-fw"
                      title={item.consolidatedIconTooltipText}
                    >
                      <Icon
                        aria-label={item.consolidatedIconTooltipText}
                        className="fa-icon-blue"
                        icon="copy"
                      />
                      {item.isLeadCase && (
                        <span className="fa-inverse lead-case-icon-text">
                          L
                        </span>
                      )}
                    </span>
                  )}
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
