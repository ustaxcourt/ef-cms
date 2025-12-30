import { BigHeader } from '../BigHeader';
import { ClerkOfCourtTrialSessionsSummary } from '../TrialSessions/ClerkOfCourtTrialSessionsSummary';
import { ErrorNotification } from '../ErrorNotification';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { RecentMessagesCotC } from '../WorkQueue/RecentMessagesCotC';
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
          <NonMobile>
            <Tabs className="margin-top-6" marginBottom={false}>
              <Tab tabName="recentMessages" title="Recent Messages">
                <RecentMessagesCotC />
              </Tab>
            </Tabs>
          </NonMobile>
          <Mobile>
            <div className="margin-top-6 margin-bottom-3">
              <select
                aria-label="dashboard section"
                className="usa-select dashboard-clerk-of-court-mobile-selector"
                data-testid="dashboard-clerk-of-court-mobile-selector"
                defaultValue="recentMessages"
              >
                <option value="recentMessages">Recent Messages</option>
              </select>
            </div>
            <div aria-controls="tabContent-recentMessages">
              <RecentMessagesCotC />
            </div>
          </Mobile>
        </section>
      </>
    );
  },
);

DashboardClerkOfCourt.displayName = 'DashboardClerkOfCourt';

