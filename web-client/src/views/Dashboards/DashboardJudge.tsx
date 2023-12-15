import { BigHeader } from '../BigHeader';
import { CaseWorksheets } from '../CaseWorksheet/CaseWorksheets';
import { ErrorNotification } from '../ErrorNotification';
import { PendingMotion } from '@web-client/views/PendingMotion/PendingMotion';
import { RecentMessages } from '../WorkQueue/RecentMessages';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '@web-client/ustc-ui/Tabs/Tabs';
import { TrialSessionsSummary } from '../TrialSessions/TrialSessionsSummary';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const DashboardJudge = connect(
  {
    caseWorksheetsHelper: state.caseWorksheetsHelper,
    pendingMotionsHelper: state.pendingMotionsHelper,
    user: state.user,
  },
  function DashboardJudge({
    caseWorksheetsHelper,
    pendingMotionsHelper,
    user,
  }) {
    return (
      <>
        <BigHeader text={`Welcome, ${user.judgeTitle} ${user.name}`} />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <TrialSessionsSummary />
          <Tabs className="margin-top-6" marginBottom={false}>
            <Tab tabName="recentMessages" title="Recent Messages">
              <RecentMessages />
            </Tab>

            <Tab
              data-testid="tab-case-worksheets"
              tabName="caseWorksheets"
              title={`Submitted/CAV (${caseWorksheetsHelper.caseWorksheetsFormatted.length})`}
            >
              <CaseWorksheets />
            </Tab>

            <Tab
              data-testid="tab-pending-motions"
              tabName="pendingMotions"
              title={`Pending Motions (${pendingMotionsHelper.formattedPendingMotions.length})`}
            >
              <PendingMotion />
            </Tab>
          </Tabs>
        </section>
      </>
    );
  },
);

DashboardJudge.displayName = 'DashboardJudge';
