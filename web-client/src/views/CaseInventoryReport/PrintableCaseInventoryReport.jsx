import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PdfPreview } from '../../ustc-ui/PdfPreview/PdfPreview';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const PrintableCaseInventoryReport = connect(
  {
    gotoCaseInventoryReportSequence: sequences.gotoCaseInventoryReportSequence,
  },
  ({ gotoCaseInventoryReportSequence }) => {
    return (
      <>
        <BigHeader text="Case Inventory Report" />
        <div className="grid-container print-docket-record">
          <Button
            link
            className="margin-bottom-3"
            onClick={() => {
              gotoCaseInventoryReportSequence();
            }}
          >
            <FontAwesomeIcon icon={['fa', 'arrow-alt-circle-left']} />
            Back to Case Inventory
          </Button>
          <PdfPreview />
        </div>
      </>
    );
  },
);
