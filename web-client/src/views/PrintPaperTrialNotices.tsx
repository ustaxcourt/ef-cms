import { Button } from '../ustc-ui/Button/Button';
import { PdfPreview } from '../ustc-ui/PdfPreview/PdfPreview';
import { WarningNotification } from './WarningNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import React from 'react';

const props = {
  printPaperServiceForTrialCompleteSequence:
    sequences.printPaperServiceForTrialCompleteSequence,
};

function PrintPaperTrialNoticesComponent({
  printPaperServiceForTrialCompleteSequence,
}: typeof props) {
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
              className="push-right margin-right-0 margin-top-2"
              data-testid="printing-complete"
              onClick={() => printPaperServiceForTrialCompleteSequence()}
            >
              Printing Complete
            </Button>
          </div>
        </div>
        <div className="print-trial-session-notices">
          <PdfPreview />
        </div>
      </section>
    </>
  );
}
export const PrintPaperTrialNotices = connect(
  props,
  PrintPaperTrialNoticesComponent,
);

PrintPaperTrialNotices.displayName = 'PrintPaperTrialNotices';
