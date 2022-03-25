import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const CaseDetailSubnavTabs = connect(
  {
    caseDetailPrimaryTabChangeSequence:
      sequences.caseDetailPrimaryTabChangeSequence,
    caseDetailSubnavHelper: state.caseDetailSubnavHelper,
  },
  function CaseDetailSubnavTabs({
    caseDetailPrimaryTabChangeSequence,
    caseDetailSubnavHelper,
  }) {
    return (
      <div className="case-detail-primary-tabs__container">
        <div className="case-detail-primary-tabs__tabs">
          <Tabs
            bind="currentViewMetadata.caseDetail.primaryTab"
            className="container-tabs-dark"
            headingLevel="2"
            onSelect={caseDetailPrimaryTabChangeSequence}
          >
            <Tab
              className="padding-left-2"
              id="tab-docket-record"
              tabName="docketRecord"
              title="Docket Record"
            />
            {caseDetailSubnavHelper.showTrackedItemsTab && (
              <Tab
                className={classNames(
                  caseDetailSubnavHelper.showTrackedItemsNotification &&
                    'tracked-items-padding-right',
                )}
                id="tab-tracked-items"
                showNotificationIcon={
                  caseDetailSubnavHelper.showTrackedItemsNotification
                }
                tabName="trackedItems"
                title="Tracked Items"
              />
            )}
            {caseDetailSubnavHelper.showDraftsTab && (
              <Tab
                draftCount={caseDetailSubnavHelper.draftDocketEntryCount}
                id="tab-drafts"
                tabName="drafts"
                title="Drafts"
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
            {caseDetailSubnavHelper.showMessagesTab && (
              <Tab
                id="tab-case-messages"
                tabName="messages"
                title="Case Messages"
              />
            )}
            {caseDetailSubnavHelper.showNotesTab && (
              <Tab
                icon="sticky-note"
                iconClass="icon-case-notes"
                iconColor="#ffbe2e"
                id="tab-notes"
                showIcon={caseDetailSubnavHelper.showNotesIcon}
                tabName="notes"
                title="Notes"
              />
            )}
          </Tabs>
        </div>
      </div>
    );
  },
);
