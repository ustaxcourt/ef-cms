import { BigHeader } from '../BigHeader';
import { ClerkOfCourtTrialSessionsSummary } from '../TrialSessions/ClerkOfCourtTrialSessionsSummary';
import { ErrorNotification } from '../ErrorNotification';
import { RecentMessages } from '../WorkQueue/RecentMessages';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '@web-client/ustc-ui/Tabs/Tabs';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const DashboardClerkOfCourt = connect(
  {
    user: state.user,
  },
  function DashboardClerkOfCourt({ user }) {
    return (
      <>
        <BigHeader text={`Welcome, ${user.name}`} />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <ClerkOfCourtTrialSessionsSummary />
          <Tabs className="margin-top-6" marginBottom={false}>
            <Tab tabName="recentMessages" title="Recent Messages">
              <RecentMessages />
            </Tab>
          </Tabs>
        </section>
      </>
    );
  },
);

DashboardClerkOfCourt.displayName = 'DashboardClerkOfCourt';

