import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { ErrorNotification } from '../ErrorNotification';
import { PendingReportList } from './PendingReportList';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React, { useState } from 'react';
import { STATE_KEYS } from '@shared/business/entities/EntityConstants';

type PendingReportProps = {};
const PendingReportDeps = {
  pendingReportTableSortData: state[STATE_KEYS.PENDING_REPORT_TABLE_SORT],
  exportPendingReportSequence: sequences.exportPendingReportSequence,
  setPendingReportSelectedJudgeSequence:
    sequences.setPendingReportSelectedJudgeSequence,
  pendingReportsData: state.pendingReports,
  pendingReportHelper: state.pendingReportHelper,
  pendingReportListHelper: state.pendingReportListHelper,
  sortTableSequence: sequences.sortTableSequence,
};

export const PendingReport = connect<
  PendingReportProps,
  typeof PendingReportDeps
>(
  PendingReportDeps,
  function PendingReport({
    exportPendingReportSequence,
    pendingReportHelper,
    pendingReportsData,
    pendingReportListHelper,
    pendingReportTableSortData,
    sortTableSequence,
    setPendingReportSelectedJudgeSequence,
  }) {
    const { pendingItemsTotal, hasPendingItemsResults } = pendingReportsData;
    const { printUrl, pendingItems } = pendingReportHelper;
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
                    href={printUrl}
                    icon="print"
                  >
                    Printable Report
                  </Button>
                </>
              </div>
            )}
          </div>

          <div className="margin-top-5">
            <PendingReportList
              pendingItems={pendingItems}
              hasPendingItemsResults={hasPendingItemsResults}
              pendingItemsTotal={pendingItemsTotal}
              sortTableSequence={sortTableSequence}
              setPendingReportSelectedJudgeSequence={
                setPendingReportSelectedJudgeSequence
              }
              pendingReportListHelper={pendingReportListHelper}
              pendingReportTableSortData={pendingReportTableSortData}
            />
          </div>
        </section>
      </>
    );
  },
);

PendingReport.displayName = 'PendingReport';
