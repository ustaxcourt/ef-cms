import { BigHeader } from '../BigHeader';
import { ErrorNotification } from '../ErrorNotification';
import { RecentMessages } from '../WorkQueue/RecentMessages';
import { SuccessNotification } from '../SuccessNotification';
import { TrialSessionsSummary } from '../TrialSessions/TrialSessionsSummary';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const DashboardJudge = connect({ user: state.user }, ({ user }) => (
  <>
    <BigHeader text={`Welcome, ${user.name}`} />
    <section className="usa-section grid-container">
      <SuccessNotification />
      <ErrorNotification />
      <div className="grid-row grid-gap">
        <div className="tablet:grid-col-8">
          <RecentMessages />
        </div>
        <div className="tablet:grid-col-4">
          <TrialSessionsSummary />
        </div>
      </div>
    </section>
  </>
));
