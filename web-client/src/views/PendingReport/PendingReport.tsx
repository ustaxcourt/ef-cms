import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { ErrorNotification } from '../ErrorNotification';
import { PendingReportList } from './PendingReportList';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React, { useState } from 'react';

export const PendingReport = connect(
  {
    exportPendingReportSequence: sequences.exportPendingReportSequence,
    formattedPendingItemsHelper: state.formattedPendingItemsHelper,
    hasPendingItemsResults: state.pendingReports.hasPendingItemsResults,
  },
  function PendingReport({
    exportPendingReportSequence,
    formattedPendingItemsHelper,
    hasPendingItemsResults,
  }) {
    const [isSubmitDebounced, setIsSubmitDebounced] = useState(false);

    const debounceSubmit = timeout => {
      setIsSubmitDebounced(true);
      setTimeout(() => {
        setIsSubmitDebounced(false);
      }, timeout);
    };

    return (
      <>
        <BigHeader text="Reports" />
        <section
          className="usa-section grid-container"
          data-testid="pending-report-container"
        >
          <SuccessNotification />
          <ErrorNotification />
          <div className="title">
            <h1>Pending Report</h1>

            {hasPendingItemsResults && (
              <div className="float-right">
                <>
                  <Button
                    link
                    aria-label="export pending report"
                    className="margin-top-2"
                    data-testid="export-pending-report"
                    disabled={isSubmitDebounced}
                    icon="file-export"
                    onClick={() => {
                      debounceSubmit(200);
                      exportPendingReportSequence();
                    }}
                  >
                    Export
                  </Button>
                  <Button
                    link
                    aria-label="print pending report"
                    className="margin-top-2"
                    data-testid="print-pending-report"
                    href={formattedPendingItemsHelper.printUrl}
                    icon="print"
                  >
                    Printable Report
                  </Button>
                </>
              </div>
            )}
          </div>

          <div className="margin-top-5">
            <PendingReportList />
          </div>
        </section>
      </>
    );
  },
);

PendingReport.displayName = 'PendingReport';
