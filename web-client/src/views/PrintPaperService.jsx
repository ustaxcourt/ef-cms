import { Button } from '../ustc-ui/Button/Button';
import { CaseDetailHeader } from './CaseDetail/CaseDetailHeader';
import { PdfPreview } from '../ustc-ui/PdfPreview/PdfPreview';
import { WarningNotification } from './WarningNotification';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const PrintPaperService = connect(
  {
    navigateBackSequence: sequences.navigateBackSequence,
  },
  function PrintPaperService({ navigateBackSequence }) {
    return (
      <>
        <CaseDetailHeader hideActionButtons />
        <section className="usa-section grid-container">
          <h2>Print Paper Service Documents</h2>
          <div className="grid-row">
            <div className="grid-col-8">
              <WarningNotification />
            </div>
            <div className="grid-col-4">
              <Button
                onClick={() => {
                  navigateBackSequence();
                }}
              >
                Done
              </Button>
            </div>
          </div>
          <div className="print-docket-record">
            <PdfPreview />
          </div>
        </section>
      </>
    );
  },
);
