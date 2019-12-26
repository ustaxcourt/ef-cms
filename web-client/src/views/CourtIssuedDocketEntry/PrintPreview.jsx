import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { PdfPreview } from '../../ustc-ui/PdfPreview/PdfPreview';
import { connect } from '@cerebral/react';
import React from 'react';

export const PrintPreview = connect({}, () => {
  return (
    <>
      <CaseDetailHeader hideActionButtons />
      <section className="usa-section grid-container">
        <h2>Print Paper Service Documents</h2>

        <div
          aria-live="assertive"
          className="usa-alert usa-alert--warning margin-bottom-4"
          role="alert"
        >
          <div className="usa-alert__body">
            <h3 className="usa-alert__heading">
              This document has been electronically served
            </h3>
            <p className="usa-alert__text">
              This case has parties receiving paper service. Print and mail all
              paper service documents below.
            </p>
          </div>
        </div>

        <div className="print-docket-record">
          <PdfPreview />
        </div>
      </section>
    </>
  );
});
