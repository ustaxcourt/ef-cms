import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { ErrorNotification } from '../ErrorNotification';
import { PendingReportList } from './PendingReportList';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const PendingReport = connect(
  {
    formattedPendingItemsHelper: state.formattedPendingItemsHelper,
    hasPendingItemsResults: state.pendingReports.hasPendingItemsResults,
  },
  function PendingReport({
    formattedPendingItemsHelper,
    hasPendingItemsResults,
  }) {
    return (
      <>
        <BigHeader text="Reports" />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <Tabs bind="reportsTab.group" defaultActiveTab="pendingReport">
            <div className="ustc-ui-tabs ustc-ui-tabs--right-button-container">
              {hasPendingItemsResults && (
                <Button
                  link
                  aria-describedby="pending-report-tab"
                  className="margin-top-2"
                  href={formattedPendingItemsHelper.printUrl}
                  icon="print"
                >
                  Printable Report
                </Button>
              )}
            </div>

            <Tab
              id="pending-report-tab"
              tabName="pendingReport"
              title="Pending Report"
            >
              <PendingReportList />
            </Tab>
          </Tabs>
        </section>
      </>
    );
  },
);

PendingReport.displayName = 'PendingReport';
