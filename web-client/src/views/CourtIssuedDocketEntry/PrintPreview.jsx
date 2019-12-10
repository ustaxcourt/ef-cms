import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetailHeader';
import { PdfPreview } from '../../ustc-ui/PdfPreview/PdfPreview';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const PrintPreview = connect(
  { printPdfFromIframeSequence: sequences.printPdfFromIframeSequence },
  ({ printPdfFromIframeSequence }) => {
    return (
      <>
        <CaseDetailHeader hideActionButtons />
        <section className="usa-section grid-container">
          <h2>Print Paper Service Documents</h2>

          <div className="display-flex flex-justify flex-align-end margin-bottom-4">
            <div
              aria-live="assertive"
              className="usa-alert usa-alert--warning margin-bottom-0"
              role="alert"
            >
              <div className="usa-alert__body">
                <h3 className="usa-alert__heading">
                  This document has been electronically served
                </h3>
                <p className="usa-alert__text">
                  This case has parties receiving paper service. Print and mail
                  all paper service documents below.
                </p>
              </div>
            </div>

            <Button
              icon="print"
              onClick={() => {
                printPdfFromIframeSequence();
              }}
            >
              Print Documents
            </Button>
          </div>

          <div className="print-docket-record">
            <PdfPreview printable />
          </div>
        </section>
      </>
    );
  },
);
