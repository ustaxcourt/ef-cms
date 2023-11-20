import { BigHeader } from '../BigHeader';
import { CaseWorksheets } from '../CaseWorksheet/CaseWorksheets';
import { ErrorNotification } from '../ErrorNotification';
import { RecentMessages } from '../WorkQueue/RecentMessages';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '@web-client/ustc-ui/Tabs/Tabs';
import { TrialSessionsSummary } from '../TrialSessions/TrialSessionsSummary';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const DashboardJudge = connect(
  { caseWorksheetsHelper: state.caseWorksheetsHelper, user: state.user },
  function DashboardJudge({ caseWorksheetsHelper, user }) {
    return (
      <>
        <BigHeader text={`Welcome, ${user.judgeTitle} ${user.name}`} />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <TrialSessionsSummary />
          <Tabs>
            <Tab tabName="recentMessages" title="Recent Messages">
              <RecentMessages />
            </Tab>

            <Tab
              tabName="caseWorksheets"
              title={`Submitted/CAV (${caseWorksheetsHelper.caseWorksheetsFormatted.length})`}
            >
              <CaseWorksheets />
            </Tab>
          </Tabs>
        </section>
      </>
    );
  },
);

DashboardJudge.displayName = 'DashboardJudge';
