import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { ConsolidatedCaseIcon } from '../../ustc-ui/Icon/ConsolidatedCaseIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const OpenCases = connect(
  {
    openCases: state.formattedTrialSessionDetails.openCases,
  },
  function OpenCases({ openCases }) {
    return (
      <React.Fragment>
        <div className="text-semibold push-right margin-bottom-2">
          Count: {openCases.length}
        </div>
        <table
          aria-describedby="open-cases-tab"
          className="usa-table ustc-table trial-sessions subsection"
          id="open-cases"
        >
          <thead>
            <tr>
              <th
                aria-label="consolidated group indicator"
                className="consolidated-indicators"
              ></th>
              <th aria-label="docket number">Docket No.</th>
              <th aria-label="manually added indicator"></th>
              <th>Case Title</th>
              <th>Petitioner Counsel</th>
              <th>Respondent Counsel</th>
              <th>Calendar Notes</th>
            </tr>
          </thead>
          {openCases.map(item => (
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
                <td>
                  {item.isManuallyAdded && (
                    <span aria-label="manually added indicator">
                      <FontAwesomeIcon
                        className="mini-success"
                        icon="calendar-plus"
                      />
                    </span>
                  )}
                </td>
                <td>{item.caseTitle}</td>
                <td>
                  {item.privatePractitioners.map(practitioner => (
                    <div key={practitioner.userId}>{practitioner.name}</div>
                  ))}
                </td>
                <td>
                  {item.irsPractitioners.map(respondent => (
                    <div key={respondent.userId}>{respondent.name}</div>
                  ))}
                </td>
                <td>
                  <div>{item.calendarNotes}</div>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
        {openCases.length === 0 && <p>There are no open cases.</p>}
      </React.Fragment>
    );
  },
);

OpenCases.displayName = 'OpenCases';
