import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
                icon={
                  caseDetailSubnavHelper.showTrackedItemsNotification && (
                    <div className="icon-tab-notification">
                      <div className="icon-tab-notification-exclamation">!</div>
                    </div>
                  )
                }
                id="tab-tracked-items"
                tabName="trackedItems"
                title="Tracked Items"
              />
            )}
            {caseDetailSubnavHelper.showDraftsTab && (
              <Tab
                icon={
                  caseDetailSubnavHelper.draftDocketEntryCount !== 0 && (
                    <div className="icon-tab-unread-messages">
                      <div className="icon-tab-unread-messages-count">
                        {caseDetailSubnavHelper.draftDocketEntryCount}
                      </div>
                    </div>
                  )
                }
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
                icon={
                  caseDetailSubnavHelper.showNotesIcon && (
                    <FontAwesomeIcon
                      className="icon-case-notes"
                      color="#ffbe2e"
                      icon="sticky-note"
                    />
                  )
                }
                id="tab-notes"
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

CaseDetailSubnavTabs.displayName = 'CaseDetailSubnavTabs';
