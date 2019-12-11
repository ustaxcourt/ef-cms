import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import React from 'react';

export const CaseDetailSubnavTabs = connect({}, () => {
  return (
    <div className="case-detail-primary-tabs__container">
      <div className="case-detail-primary-tabs__tabs">
        <Tabs bind="caseDetailPage.primaryTab" className="container-tabs-dark">
          <Tab
            className="padding-left-2"
            id="tab-docket-record"
            tabName="docketRecord"
            title="Docket Record"
          />
          <Tab id="tab-deadlines" tabName="deadlines" title="Deadlines" />
          <Tab id="tab-in-progress" tabName="inProgress" title="In Progress" />
          <Tab
            id="tab-case-information"
            tabName="caseInformation"
            title="Case Information"
          />
          <Tab id="tab-notes" tabName="notes" title="Notes" />
        </Tabs>
      </div>
    </div>
  );
});
