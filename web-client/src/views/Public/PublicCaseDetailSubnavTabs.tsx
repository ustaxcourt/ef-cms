import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@web-client/presenter/shared.cerebral';
import React from 'react';

export const PublicCaseDetailSubnavTabs = connect(
  {},
  function PublicCaseDetailSubnavTabs() {
    return (
      <div className="case-detail-primary-tabs__container">
        <div className="case-detail-primary-tabs__tabs">
          <Tabs
            bind="currentViewMetadata.caseDetail.primaryTab"
            className="container-tabs-dark"
            headingLevel="2"
          >
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
  },
);

PublicCaseDetailSubnavTabs.displayName = 'PublicCaseDetailSubnavTabs';
