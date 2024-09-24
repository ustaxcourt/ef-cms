import { CaseLink } from '@web-client/ustc-ui/CaseLink/CaseLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Icon } from '@web-client/ustc-ui/Icon/Icon';
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
      <div className="margin-top-1">
        <table
          aria-label="Open Cases"
          className="usa-table ustc-table"
          id={'practitioner-open-cases-table'}
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
            <tr key={item.pk}>
              <td aria-hidden="true" className="filing-type-icon">
                {item.isSealed && (
                  <FontAwesomeIcon
                    className="sealed-in-blackstone icon-sealed"
                    icon="lock"
                    size="1x"
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
                      <span className="fa-inverse lead-case-icon-text">L</span>
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
      </div>
    </>
  );
}
