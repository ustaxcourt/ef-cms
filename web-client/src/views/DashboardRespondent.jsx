import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

import ErrorNotification from './ErrorNotification';
import SuccessNotification from './SuccessNotification';

export const DashboardRespondent = connect(
  {
    caseList: state.formattedCases,
    helper: state.dashboardRespondentHelper,
    user: state.user,
  },
  ({ caseList, helper, user }) => {
    return (
      <section className="usa-section usa-grid">
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
          <table className="responsive-table work-queue" id="workQueue">
            <thead>
              <tr>
                <th>Docket number</th>
                <th>Petitioner name</th>
                <th>Date filed</th>
              </tr>
            </thead>
            <tbody>
              {caseList.map(item => (
                <tr key={item.docketNumber}>
                  <td className="responsive-title">
                    <span className="responsive-label">Docket number</span>
                    <a href={'/case-detail/' + item.docketNumber}>
                      {item.docketNumberWithSuffix}
                    </a>
                  </td>
                  <td>
                    <span className="responsive-label">Petitioner name</span>
                    {item.petitionerName}
                  </td>
                  <td>
                    <span className="responsive-label">Date filed</span>
                    {item.createdAtFormatted}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    );
  },
);
