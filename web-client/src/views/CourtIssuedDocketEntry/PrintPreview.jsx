import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { PdfPreview } from '../../ustc-ui/PdfPreview/PdfPreview';
import { WarningNotification } from '../WarningNotification';
import { connect } from '@cerebral/react';
import React from 'react';

export const PrintPreview = connect({}, () => {
  return (
    <>
      <CaseDetailHeader hideActionButtons />
      <section className="usa-section grid-container">
        <h2>Print Paper Service Documents</h2>
        <WarningNotification />
        <div className="print-docket-record">
          <PdfPreview />
        </div>
      </section>
    </>
  );
});
