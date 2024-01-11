import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { ConsolidatedCaseIcon } from '../../ustc-ui/Icon/ConsolidatedCaseIcon';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const InactiveCases = connect(
  {
    inactiveCases: state.formattedTrialSessionDetails!.inactiveCases,
  },
  function InactiveCases({ inactiveCases }) {
    return (
      <React.Fragment>
        <div className="text-semibold push-right margin-bottom-2">
          Count: {inactiveCases.length}
        </div>
        <table
          aria-describedby="inactive-cases-tab"
          className="usa-table ustc-table trial-sessions subsection"
          id="inactive-cases"
        >
          <thead>
            <tr>
              <th
                aria-label="consolidated group indicator"
                className="consolidated-indicators"
              ></th>
              <th aria-label="Docket Number">Docket No.</th>
              <th>Case Title</th>
              <th>Disposition</th>
              <th>Disposition Date</th>
            </tr>
          </thead>
          {inactiveCases.map(item => (
            <tbody key={item.docketNumber}>
              <tr className="eligible-cases-row">
                <td>
                  <span
                    className={classNames({
                      'margin-left-2': item.shouldIndent,
                    })}
                  >
                    <ConsolidatedCaseIcon
                      consolidatedIconTooltipText={
                        item.consolidatedIconTooltipText
                      }
                      inConsolidatedGroup={item.inConsolidatedGroup}
                      showLeadCaseIcon={item.isLeadCase}
                    />
                  </span>
                </td>
                <td>
                  <span
                    className={classNames({
                      'margin-left-2': item.shouldIndent,
                    })}
                  >
                    <CaseLink formattedCase={item} />
                  </span>
                </td>
                <td>{item.caseTitle}</td>
                <td>{item.disposition}</td>
                <td>{item.removedFromTrialDateFormatted}</td>
              </tr>
            </tbody>
          ))}
        </table>
        {inactiveCases.length === 0 && <p>There are no inactive cases.</p>}
      </React.Fragment>
    );
  },
);

InactiveCases.displayName = 'InactiveCases';
