import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PdfPreview } from '../../ustc-ui/PdfPreview/PdfPreview';
import { WarningNotification } from '../WarningNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const PrintableTrialSessionWorkingCopyPreviewPage = connect(
  {
    gotoTrialSessionWorkingCopySequence:
      sequences.gotoTrialSessionWorkingCopySequence,
    trialSessionId: state.trialSession.trialSessionId,
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

PrintableTrialSessionWorkingCopyPreviewPage.displayName =
  'PrintableTrialSessionWorkingCopyPreviewPage';
