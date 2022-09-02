import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { PdfPreview } from '../../ustc-ui/PdfPreview/PdfPreview';
import { connect } from '@cerebral/react';
import React from 'react';

export const TrialSessionCopyReport = connect(
  {},
  function TrialSessionPlanningReport() {
    return (
      <>
        {/* <BigHeader text="Trial Session COPY Report" />
        <div className="grid-container print-docket-record">
          <Button
            link
            className="margin-bottom-3"
            href="/trial-sessions"
            icon={['fa', 'arrow-alt-circle-left']}
          >
            Back to Trial Sessions (IN THE COPY REPORT)
          </Button> */}
        <PdfPreview />
        {/* </div> */}
      </>
    );
  },
);
