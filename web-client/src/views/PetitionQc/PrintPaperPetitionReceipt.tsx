import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { PdfPreview } from '../../ustc-ui/PdfPreview/PdfPreview';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const PrintPaperPetitionReceipt = connect(
  {
    completePrintPaperPetitionReceiptSequence:
      sequences.completePrintPaperPetitionReceiptSequence,
  },
  function PrintPaperPetitionReceipt({
    completePrintPaperPetitionReceiptSequence,
  }) {
    return (
      <>
        <CaseDetailHeader hideActionButtons />
        <section className="usa-section grid-container">
          <div className="grid-row">
            <div className="grid-col-8">
              <h2>Print Paper Petition Receipt</h2>
            </div>
            <div className="grid-col-4">
              <Button
                className="push-right margin-right-0 margin-bottom-4"
                data-testid="done-viewing-paper-petition-receipt-button"
                id="done-viewing-paper-petition-receipt-button"
                onClick={() => {
                  completePrintPaperPetitionReceiptSequence();
                }}
              >
                Done
              </Button>
            </div>
          </div>
          <div className="print-petition-receipt">
            <PdfPreview />
          </div>
        </section>
      </>
    );
  },
);

PrintPaperPetitionReceipt.displayName = 'PrintPaperPetitionReceipt';
