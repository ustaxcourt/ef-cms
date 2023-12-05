import { Button } from '../ustc-ui/Button/Button';
import { CaseDetailHeader } from './CaseDetail/CaseDetailHeader';
import { PdfPreview } from '../ustc-ui/PdfPreview/PdfPreview';
import { WarningNotification } from './WarningNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const PrintPaperService = connect(
  {
    navigateToCaseDetailFromPaperServiceSequence:
      sequences.navigateToCaseDetailFromPaperServiceSequence,
    printPaperServiceHelper: state.printPaperServiceHelper,
  },
  function PrintPaperService({
    navigateToCaseDetailFromPaperServiceSequence,
    printPaperServiceHelper,
  }) {
    return (
      <>
        <CaseDetailHeader hideActionButtons />
        <section className="usa-section grid-container">
          <h2>
            Print {printPaperServiceHelper.documentTitle} for Paper Service
          </h2>
          <div className="grid-row">
            <div className="grid-col-8">
              <WarningNotification />
            </div>
            <div className="grid-col-4">
              <Button
                className="push-right margin-right-0 margin-top-6"
                data-testid="print-paper-service-done-button"
                id="print-paper-service-done-button"
                onClick={() => {
                  navigateToCaseDetailFromPaperServiceSequence();
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

PrintPaperService.displayName = 'PrintPaperService';
