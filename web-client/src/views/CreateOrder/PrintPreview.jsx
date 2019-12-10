import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetailHeader';
import { PdfPreview } from '../../ustc-ui/PdfPreview/PdfPreview';
import { connect } from '@cerebral/react';
import React from 'react';

export const PrintPreview = connect({}, () => {
  return (
    <>
      <CaseDetailHeader hideActionButtons />
      <div className="grid-container print-docket-record">
        <Button
          link
          className="margin-bottom-3"
          icon={['fa', 'arrow-alt-circle-left']}
        >
          Notice, Print Buttons go here
        </Button>
        <PdfPreview />
      </div>
    </>
  );
});
