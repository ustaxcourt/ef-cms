import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { ErrorNotification } from '../ErrorNotification';
import { PendingReportList } from './PendingReportList';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
// import { sequences } from 'cerebral';
import React from 'react';

export const PendingReport = connect({}, () => {
  return (
    <>
      <BigHeader text="Reports" />
      <section className="usa-section grid-container">
        <SuccessNotification />
        <ErrorNotification />

        <Tabs bind="reportsTab.group" defaultActiveTab="pendingReport">
          <div className="ustc-ui-tabs ustc-ui-tabs--right-button-container">
            <Button
              link
              className="margin-top-2"
              icon="print"
              onClick={() => true}
            >
              Print Report
            </Button>
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
});
