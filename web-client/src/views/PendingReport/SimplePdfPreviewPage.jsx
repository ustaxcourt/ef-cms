import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PdfPreview } from '../../ustc-ui/PdfPreview/PdfPreview';
import { WarningNotification } from '../WarningNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SimplePdfPreviewPage = connect(
  {
    headerTitle: state.screenMetadata.headerTitle,
    navigateBackSequence: sequences.navigateBackSequence,
  },
  function SimplePdfPreviewPage({ headerTitle, navigateBackSequence }) {
    return (
      <>
        <BigHeader text={headerTitle} />
        <div className="grid-container print-planning-report">
          <WarningNotification />
          <Button
            link
            className="margin-bottom-3"
            onClick={() => {
              navigateBackSequence();
            }}
          >
            <FontAwesomeIcon icon={['fa', 'arrow-alt-circle-left']} />
            Back
          </Button>
          <PdfPreview />
        </div>
      </>
    );
  },
);

SimplePdfPreviewPage.displayName = 'SimplePdfPreviewPage';
