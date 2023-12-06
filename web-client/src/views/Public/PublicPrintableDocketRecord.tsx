import { Button } from '../../ustc-ui/Button/Button';
import { PdfPreview } from '../../ustc-ui/PdfPreview/PdfPreview';
import { PublicCaseDetailHeader } from './PublicCaseDetailHeader';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const PublicPrintableDocketRecord = connect(
  {
    navigateBackSequence: sequences.navigateBackSequence,
  },
  function PublicPrintableDocketRecord({ navigateBackSequence }) {
    return (
      <>
        <PublicCaseDetailHeader />
        <div className="grid-container print-docket-record">
          <Button
            link
            className="margin-bottom-3"
            icon={['fa', 'arrow-alt-circle-left']}
            onClick={() => {
              navigateBackSequence();
            }}
          >
            Back
          </Button>
          <PdfPreview />
        </div>
      </>
    );
  },
);

PublicPrintableDocketRecord.displayName = 'PublicPrintableDocketRecord';
