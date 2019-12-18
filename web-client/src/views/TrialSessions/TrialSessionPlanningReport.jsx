import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PdfPreview } from '../../ustc-ui/PdfPreview/PdfPreview';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const TrialSessionPlanningReport = connect(
  { gotoTrialSessionsSequence: sequences.gotoTrialSessionsSequence },
  ({ gotoTrialSessionsSequence }) => {
    return (
      <>
        <BigHeader text="Trial Session Planning Report" />
        <div className="grid-container print-docket-record">
          <Button
            link
            className="margin-bottom-3"
            onClick={() => {
              gotoTrialSessionsSequence();
            }}
          >
            <FontAwesomeIcon icon={['fa', 'arrow-alt-circle-left']} />
            Back to Trial Sessions
          </Button>
          <PdfPreview />
        </div>
      </>
    );
  },
);
