import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CaseDetailSubnavTabs = connect(
  {
    caseDetailSubnavHelper: state.caseDetailSubnavHelper,
    clearAlertSequence: sequences.clearAlertSequence,
  },
  function CaseDetailSubnavTabs({
    caseDetailSubnavHelper,
    clearAlertSequence,
  }) {
    return (
      <div className="case-detail-primary-tabs__container">
        <div className="case-detail-primary-tabs__tabs">
          <Tabs
            bind="currentViewMetadata.caseDetail.primaryTab"
            className="container-tabs-dark"
            onSelect={() => clearAlertSequence()}
          >
            <Tab
              className="padding-left-2"
              id="tab-docket-record"
              tabName="docketRecord"
              title="Docket Record"
            />
            {caseDetailSubnavHelper.showDeadlinesTab && (
              <Tab id="tab-deadlines" tabName="deadlines" title="Deadlines" />
            )}
            {caseDetailSubnavHelper.showInProgressTab && (
              <Tab
                id="tab-in-progress"
                tabName="inProgress"
                title="In Progress"
              />
            )}
            {caseDetailSubnavHelper.showCorrespondenceTab && (
              <Tab
                id="tab-correspondence"
                tabName="correspondence"
                title="Correspondence"
              />
            )}
            {caseDetailSubnavHelper.showCaseInformationTab && (
              <Tab
                id="tab-case-information"
                tabName="caseInformation"
                title="Case Information"
              />
            )}
            {caseDetailSubnavHelper.showNotesTab && (
              <Tab id="tab-notes" tabName="notes" title="Notes" />
            )}
          </Tabs>
        </div>
      </div>
    );
  },
);
