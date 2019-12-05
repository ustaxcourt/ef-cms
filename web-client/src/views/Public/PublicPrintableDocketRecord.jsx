import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
