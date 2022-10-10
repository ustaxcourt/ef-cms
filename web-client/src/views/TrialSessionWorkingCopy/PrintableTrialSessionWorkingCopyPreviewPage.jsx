import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PdfPreview } from '../../ustc-ui/PdfPreview/PdfPreview';
import { WarningNotification } from '../WarningNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PrintableTrialSessionWorkingCopyPreviewPage = connect(
  {
    gotoTrialSessionWorkingCopySequence:
      sequences.gotoTrialSessionWorkingCopySequence,
    trialSessionId: state.trialSessionId,
  },
  function PrintableTrialSessionWorkingCopyPreviewPage({
    gotoTrialSessionWorkingCopySequence,
    trialSessionId,
  }) {
    return (
      <>
        <BigHeader text="Printable Session Copy" />
        <div className="grid-container print-planning-report">
          <WarningNotification />
          <Button
            link
            className="margin-bottom-3"
            onClick={() => {
              gotoTrialSessionWorkingCopySequence({
                trialSessionId,
              });
            }}
          >
            <FontAwesomeIcon icon={['fa', 'arrow-alt-circle-left']} />
            Back to Session Copy
          </Button>
          <PdfPreview />
        </div>
      </>
    );
  },
);
