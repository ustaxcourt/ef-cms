import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { PdfPreview } from '../../ustc-ui/PdfPreview/PdfPreview';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const TrialSessionCopyReport = connect(
  {
    formattedTrialSessionDetails: state.formattedTrialSessionDetails,
  },
  function TrialSessionPlanningReport({ formattedTrialSessionDetails }) {
    return (
      <>
        <BigHeader text="Trial Session COPY" />
        <div className="grid-container print-docket-record">
          <Button
            link
            className="margin-bottom-3"
            href={`/trial-session-working-copy/${formattedTrialSessionDetails.trialSessionId}`}
            icon={['fa', 'arrow-alt-circle-left']}
          >
            Back to Trial Sessions (IN THE COPY REPORT)
          </Button>
          <PdfPreview />
        </div>
      </>
    );
  },
);
