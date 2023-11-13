import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PdfPreview } from '../../ustc-ui/PdfPreview/PdfPreview';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const PrintableDocketRecord = connect(
  {
    navigateBackSequence: sequences.navigateBackSequence,
  },
  function PrintableDocketRecord({ navigateBackSequence }) {
    return (
      <>
        <CaseDetailHeader hideActionButtons />
        <div className="grid-container print-docket-record">
          <Button
            link
            className="margin-bottom-3"
            onClick={() => {
              navigateBackSequence();
            }}
          >
            <FontAwesomeIcon icon={['fa', 'arrow-alt-circle-left']} />
            Back
          </Button>
          <PdfPreview />
        </div>
      </>
    );
  },
);

PrintableDocketRecord.displayName = 'PrintableDocketRecord';
