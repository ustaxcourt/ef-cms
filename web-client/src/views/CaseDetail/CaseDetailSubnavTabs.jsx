import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CaseDetailSubnavTabs = connect(
  {
    caseDetailSubnavHelper: state.caseDetailSubnavHelper,
    clearAlertSequence: sequences.clearAlertSequence,
    setCaseDetailPrimaryTabSequence: sequences.setCaseDetailPrimaryTabSequence,
  },
  function CaseDetailSubnavTabs({
    caseDetailSubnavHelper,
    clearAlertSequence,
    setCaseDetailPrimaryTabSequence,
  }) {
    return (
      <div className="case-detail-primary-tabs__container">
        <div className="case-detail-primary-tabs__tabs">
          <Tabs
            bind="currentViewMetadata.caseDetail.primaryTab"
            className="container-tabs-dark"
            onSelect={() => {
              clearAlertSequence();
              setCaseDetailPrimaryTabSequence();
            }}
          >
            <Tab
              className="padding-left-2"
              id="tab-docket-record"
              tabName="docketRecord"
              title="Docket Record"
            />
            {caseDetailSubnavHelper.showTrackedItemsTab && (
              <Tab
                id="tab-tracked-items"
                tabName="trackedItems"
                title="Tracked Items"
              />
            )}
            {caseDetailSubnavHelper.showDraftsTab && (
              <Tab id="tab-drafts" tabName="drafts" title="Drafts" />
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
            {caseDetailSubnavHelper.showMessagesTab && (
              <Tab
                id="tab-case-messages"
                tabName="messages"
                title="Case Messages"
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
