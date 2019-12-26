import { Button } from '../../ustc-ui/Button/Button';
import { PdfPreview } from '../../ustc-ui/PdfPreview/PdfPreview';
import { PublicCaseDetailHeader } from './PublicCaseDetailHeader';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const PublicPrintableDocketRecord = connect(
  {
    navigateBackSequence: sequences.navigateBackSequence,
  },
  ({ navigateBackSequence }) => {
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
