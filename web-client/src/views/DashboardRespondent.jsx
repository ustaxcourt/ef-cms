import { BigHeader } from './BigHeader';
import { ErrorNotification } from './ErrorNotification';
import { SuccessNotification } from './SuccessNotification';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const DashboardRespondent = connect(
  {
    caseList: state.formattedCases,
    helper: state.dashboardRespondentHelper,
    user: state.user,
  },
  ({ caseList, helper, user }) => {
    return (
      <React.Fragment>
        <BigHeader text={`Welcome, ${user.name}`} />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <h2>Your Cases</h2>
          {helper.showNoCasesMessage && (
            <p>
              You are not associated with any cases. Search for a case to file
              an Answer.
            </p>
          )}
          {helper.showCaseList && (
            <div className="grid-row grid-gap taxpayer-tools">
              <div className="tablet:grid-col-8">
                <table
                  className="usa-table responsive-table dashboard"
                  id="workQueue"
                >
                  <thead>
                    <tr>
                      <th>Docket Number</th>
                      <th>Petitioner Name</th>
                      <th>Date Filed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {caseList.map(item => (
                      <tr key={item.docketNumber}>
                        <td className="show-on-mobile">
                          {item.createdAtFormatted}
                        </td>
                        <td>
                          <a href={'/case-detail/' + item.docketNumber}>
                            {item.docketNumberWithSuffix}
                          </a>
                          <div className="show-on-mobile">{item.caseName}</div>
                        </td>
                        <td className="hide-on-mobile">{item.caseName}</td>
                        <td className="hide-on-mobile">
                          {item.createdAtFormatted}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </React.Fragment>
    );
  },
);
