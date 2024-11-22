import { BigHeader } from '@web-client/views/BigHeader';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { connect } from '@web-client/presenter/shared.cerebral';
import React from 'react';

export const TrialSessionPlanningReportView = connect(
  {},
  function TrialSessionPlanningReportView() {
    return (
      <>
        <BigHeader text="Trial Session Planning Report" />
        <div className="grid-container print-docket-record">
          <Button
            link
            className="margin-bottom-3"
            href="/trial-sessions"
            icon={['fa', 'arrow-alt-circle-left']}
          >
            Back to Trial Sessions
          </Button>
        </div>
      </>
    );
  },
);

TrialSessionPlanningReportView.displayName = 'TrialSessionPlanningReport';
