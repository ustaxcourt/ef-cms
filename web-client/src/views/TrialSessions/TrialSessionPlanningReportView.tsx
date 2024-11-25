import { BigHeader } from '@web-client/views/BigHeader';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const TrialSessionPlanningReportView = connect(
  {
    trialSessionPlanningReportData: state.trialSessionPlanningReportData,
  },
  function TrialSessionPlanningReportView({ trialSessionPlanningReportData }) {
    const { trialTerm, trialYear } = trialSessionPlanningReportData;
    return (
      <>
        <BigHeader text="Trial Session Planning Report" />
        <div className="grid-container">
          <Button
            link
            className="margin-bottom-3"
            href="/trial-sessions"
            icon={['fa', 'arrow-alt-circle-left']}
          >
            Back to Trial Sessions
          </Button>
        </div>
        <div className="grid-container grid-row">
          <div className="h1-size grid-col-2">
            {trialTerm} {trialYear}
          </div>
          <div className="bg-secondary grid-col-10">
            {trialTerm} {trialYear}
          </div>
        </div>
      </>
    );
  },
);

TrialSessionPlanningReportView.displayName = 'TrialSessionPlanningReport';
