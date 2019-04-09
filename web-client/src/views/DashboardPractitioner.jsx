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
      <section className="usa-section usa-grid">
        <h1 tabIndex="-1">Welcome, {user.name}</h1>
        <SuccessNotification />
        <ErrorNotification />
        <CaseListPractitioner />
      </section>
    );
  },
);
