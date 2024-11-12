import { CaseIcons } from '@web-client/ustc-ui/Icon/CaseIcons';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const AllCases = connect(
  {
    allCases: state.formattedTrialSessionDetails.allCases,
  },
  function AllCases({ allCases }) {
    return (
      <React.Fragment>
        <div className="text-right">
          <span className="text-semibold">Count: </span>
          {allCases.length}
        </div>
        <div className="padding-1"></div>
        <div className="overflow-x-auto overflow-y-hidden">
          <table
            aria-describedby="all-cases-tab"
            className="usa-table ustc-table trial-sessions subsection"
            id="all-cases"
          >
            <thead>
              <tr>
                <th
                  aria-label="Icons for consolidated and/or sealed cases"
                  className="consolidated-indicators"
                ></th>
                <th aria-label="Docket Number">Docket No.</th>
                <th aria-label="manually added indicator"></th>
                <th>Case Title</th>
                <th>Case Status</th>
                <th>Disposition</th>
                <th>Disposition Date</th>
              </tr>
            </thead>
            {allCases.map(item => (
              <tbody key={item.docketNumber}>
                <tr className="eligible-cases-row">
                  <td>
                    <CaseIcons formattedCase={item} />
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
                          title="Manually added"
                        />
                      </span>
                    )}
                  </td>
                  <td>{item.caseTitle}</td>
                  <td>{item.status}</td>
                  <td>{item.disposition}</td>
                  <td>{item.removedFromTrialDateFormatted}</td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
        {allCases.length === 0 && <p>There are no cases.</p>}
      </React.Fragment>
    );
  },
);

AllCases.displayName = 'AllCases';
