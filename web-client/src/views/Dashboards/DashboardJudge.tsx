import { BigHeader } from '../BigHeader';
import { CaseWorksheets } from '../CaseWorksheet/CaseWorksheets';
import { ErrorNotification } from '../ErrorNotification';
import { RecentMessages } from '../WorkQueue/RecentMessages';
import { SuccessNotification } from '../SuccessNotification';
import { TrialSessionsSummary } from '../TrialSessions/TrialSessionsSummary';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const DashboardJudge = connect(
  { user: state.user },
  function DashboardJudge({ user }) {
    return (
      <>
        <BigHeader text={`Welcome, ${user.judgeTitle} ${user.name}`} />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <TrialSessionsSummary />
          <RecentMessages />
          <CaseWorksheets />
        </section>
      </>
    );
  },
);

DashboardJudge.displayName = 'DashboardJudge';
