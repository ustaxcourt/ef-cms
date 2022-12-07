import { BigHeader } from '../BigHeader';
import { ErrorNotification } from '../ErrorNotification';
import { RecentMessages } from '../WorkQueue/RecentMessages';
import { SuccessNotification } from '../SuccessNotification';
import { TrialSessionsSummary } from '../TrialSessions/TrialSessionsSummary';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const DashboardChambers = connect(
  { user: state.user },
  function DashboardChambers({ user }) {
    return (
      <>
        <BigHeader text={`Welcome, ${user.name}`} />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />

          <TrialSessionsSummary />
          <RecentMessages />
        </section>
      </>
    );
  },
);

DashboardChambers.displayName = 'DashboardChambers';
