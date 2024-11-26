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
        <TrialSessionPlanningReportHeader
          trialTerm={trialTerm}
          trialYear={trialYear}
        />
      </>
    );
  },
);

TrialSessionPlanningReportView.displayName = 'TrialSessionPlanningReport';

type TrialSessionPlanningReportHeaderParams = {
  trialTerm: string;
  trialYear: number;
};

function TrialSessionPlanningReportHeader({
  trialTerm,
  trialYear,
}: TrialSessionPlanningReportHeaderParams) {
  return (
    <div className="grid-container display-flex height-6">
      <div
        className="flex-auto border-bottom-2px border-primary"
        style={{
          fontFamily: 'Noto Serif JP',
          fontSize: '32px',
        }}
      >
        {trialTerm} {trialYear}
      </div>
      <div className="flex-fill text-right height-6 border-bottom-1px border-gray-10">
        <Button
          link
          className="margin-bottom-3"
          href="/trial-sessions"
          icon="print"
        >
          Print
        </Button>
      </div>
    </div>
  );
}
