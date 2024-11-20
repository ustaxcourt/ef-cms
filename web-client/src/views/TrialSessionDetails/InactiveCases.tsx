import { CaseIcons } from '@web-client/ustc-ui/Icon/CaseIcons';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const InactiveCases = connect(
  {
    inactiveCases: state.formattedTrialSessionDetails.inactiveCases,
  },
  function InactiveCases({ inactiveCases }) {
    return (
      <React.Fragment>
        <div className="text-right">
          <span className="text-semibold">Count: </span>
          {inactiveCases.length}
        </div>
        <div className="padding-1"></div>
        <div className="overflow-x-auto overflow-y-hidden">
          <table
            aria-describedby="inactive-cases-tab"
            className="usa-table ustc-table trial-sessions subsection"
            id="inactive-cases"
          >
            <thead>
              <tr>
                <th
                  aria-label="Icons for consolidated and/or sealed cases"
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
                  <td>{item.caseTitle}</td>
                  <td>{item.disposition}</td>
                  <td>{item.removedFromTrialDateFormatted}</td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
        {inactiveCases.length === 0 && <p>There are no inactive cases.</p>}
      </React.Fragment>
    );
  },
);

InactiveCases.displayName = 'InactiveCases';
