import { CaseListPractitioner } from './CaseListPractitioner';
import { ErrorNotification } from './ErrorNotification';
import { SuccessNotification } from './SuccessNotification';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const DashboardPractitioner = connect(
  { helper: state.dashboardPetitionerHelper, user: state.user },
  ({ user }) => {
    return (
      <React.Fragment>
        <div className="big-blue-header">
          <div className="grid-container">
            <h1 tabIndex="-1">Welcome, {user.name}</h1>
          </div>
        </div>
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <CaseListPractitioner />
        </section>
      </React.Fragment>
    );
  },
);
