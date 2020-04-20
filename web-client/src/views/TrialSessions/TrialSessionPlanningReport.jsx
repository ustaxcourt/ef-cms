import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PdfPreview } from '../../ustc-ui/PdfPreview/PdfPreview';
import { connect } from '@cerebral/react';
import React from 'react';

export const TrialSessionPlanningReport = connect(
  {},
  function TrialSessionPlanningReport() {
    return (
      <>
        <BigHeader text="Trial Session Planning Report" />
        <div className="grid-container print-docket-record">
          <Button link className="margin-bottom-3" href="/trial-sessions">
            <FontAwesomeIcon icon={['fa', 'arrow-alt-circle-left']} />
            Back to Trial Sessions
          </Button>
          <PdfPreview />
        </div>
      </>
    );
  },
);
