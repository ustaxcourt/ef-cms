import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import React from 'react';

export const PublicCaseDetailSubnavTabs = connect({}, () => {
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
        </Tabs>
      </div>
    </div>
  );
});
