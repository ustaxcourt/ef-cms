import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { PdfPreview } from '../../ustc-ui/PdfPreview/PdfPreview';
import { WarningNotification } from '../WarningNotification';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const PrintPreview = connect(
  {
    navigateBackSequence: sequences.navigateBackSequence,
  },
  function PrintPreview({ navigateBackSequence }) {
    return (
      <>
        <CaseDetailHeader hideActionButtons />
        <section className="usa-section grid-container">
          <Button
            link
            onClick={() => {
              navigateBackSequence();
            }}
          >
            Back
          </Button>
          <h2>Print Paper Service Documents</h2>
          <WarningNotification />
          <div className="print-docket-record">
            <PdfPreview />
          </div>
        </section>
      </>
    );
  },
);
