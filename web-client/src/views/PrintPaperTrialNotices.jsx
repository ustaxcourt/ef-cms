import { Button } from '../ustc-ui/Button/Button';
import { PdfPreview } from '../ustc-ui/PdfPreview/PdfPreview';
import { WarningNotification } from './WarningNotification';
import { connect } from '@cerebral/react';
import React from 'react';

export const PrintPaperTrialNotices = connect(
  {},
  function PrintPaperTrialNotices() {
    return (
      <>
        <div className="big-blue-header">
          <div className="grid-container">
            <div className="margin-bottom-1">
              <h1>Print Paper Service</h1>
            </div>
          </div>
        </div>
        <section className="usa-section grid-container">
          <div className="grid-row">
            <div className="grid-col-8">
              <WarningNotification />
            </div>
            <div className="grid-col-4">
              <Button
                className="push-right margin-right-0 margin-top-6"
                href="/trial-sessions"
              >
                Done
              </Button>
            </div>
          </div>
          <div className="print-trial-session-notices">
            <PdfPreview />
          </div>
        </section>
      </>
    );
  },
);
