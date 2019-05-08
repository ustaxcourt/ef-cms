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
      <section className="usa-section grid-container">
        <h1 tabIndex="-1">Welcome, {user.name}</h1>
        <SuccessNotification />
        <ErrorNotification />
        <h2>Your Cases</h2>
        {helper.showNoCasesMessage && (
          <p>
            You have no cases assigned to you. Search for a case to file an
            Answer.
          </p>
        )}
        {helper.showCaseList && (
          <table className="responsive-table dashboard" id="workQueue">
            <thead>
              <tr>
                <th>Docket Number</th>
                <th>Case Name</th>
                <th>Date Filed</th>
              </tr>
            </thead>
            <tbody>
              {caseList.map(item => (
                <tr key={item.docketNumber}>
                  <td className="show-on-mobile">{item.createdAtFormatted}</td>
                  <td>
                    <a href={'/case-detail/' + item.docketNumber}>
                      {item.docketNumberWithSuffix}
                    </a>
                    <div className="show-on-mobile">{item.caseName}</div>
                  </td>
                  <td className="hide-on-mobile">{item.caseName}</td>
                  <td className="hide-on-mobile">{item.createdAtFormatted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    );
  },
);
