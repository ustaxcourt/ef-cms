import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { PdfPreview } from '../../ustc-ui/PdfPreview/PdfPreview';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const PrintableCaseInventoryReport = connect(
  {
    gotoCaseInventoryReportSequence: sequences.gotoCaseInventoryReportSequence,
  },
  function PrintableCaseInventoryReport({ gotoCaseInventoryReportSequence }) {
    return (
      <>
        <BigHeader text="Case Inventory Report" />
        <div className="grid-container print-docket-record">
          <Button
            link
            aria-label="back to case inventory"
            className="margin-bottom-3"
            icon={['fa', 'arrow-alt-circle-left']}
            onClick={() => {
              gotoCaseInventoryReportSequence();
            }}
          >
            Back to Case Inventory
          </Button>
          <PdfPreview />
        </div>
      </>
    );
  },
);

PrintableCaseInventoryReport.displayName = 'PrintableCaseInventoryReport';
