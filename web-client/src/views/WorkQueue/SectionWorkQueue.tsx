import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SectionWorkQueueInProgress } from './SectionWorkQueueInProgress';
import { SectionWorkQueueInbox } from './SectionWorkQueueInbox';
import { SectionWorkQueueOutbox } from './SectionWorkQueueOutbox';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { WorkQueueActionButtons } from './WorkQueueActionButtons';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

const WorkQueueLoadingSpinner = () => (
  <div className="padding-4 text-center">
    <FontAwesomeIcon className="fa-spin spinner" icon="spinner" size="2x" />
  </div>
);

export const SectionWorkQueue = connect(
  {
    isLoadingWorkQueue: state.workQueuePage.isLoadingWorkQueue,
    queue: state.workQueueToDisplay.queue,
    switchWorkQueueTabSequence: sequences.switchWorkQueueTabSequence,
    workQueueHelper: state.workQueueHelper,
  },
  function SectionWorkQueue({
    isLoadingWorkQueue,
    queue,
    switchWorkQueueTabSequence,
    workQueueHelper,
  }) {
    return (
      <Tabs
        bind="workQueueToDisplay.box"
        className="classic-horizontal-header3 tab-border"
        onSelect={box => {
          switchWorkQueueTabSequence({
            box,
            queue,
          });
        }}
      >
        <WorkQueueActionButtons />

        <Tab
          data-testid="section-inbox-tab"
          tabName="inbox"
          title={`Inbox (${workQueueHelper.sectionInboxCount})`}
        >
          <div id="section-inbox-tab-content">
            {isLoadingWorkQueue ? (
              <WorkQueueLoadingSpinner />
            ) : (
              <SectionWorkQueueInbox />
            )}
          </div>
        </Tab>
        {workQueueHelper.showInProgressTab && (
          <Tab
            id="section-in-progress-tab"
            tabName="inProgress"
            title={`In Progress (${workQueueHelper.sectionInProgressCount})`}
          >
            <div id="section-in-progress-tab-content">
              {isLoadingWorkQueue ? (
                <WorkQueueLoadingSpinner />
              ) : (
                <SectionWorkQueueInProgress />
              )}
            </div>
          </Tab>
        )}
        {workQueueHelper.showSectionSentTab && (
          <Tab
            id="section-sent-tab"
            tabName="outbox"
            title={workQueueHelper.sentTitle}
          >
            <div id="section-sent-tab-content">
              {isLoadingWorkQueue ? (
                <WorkQueueLoadingSpinner />
              ) : (
                <SectionWorkQueueOutbox />
              )}
            </div>
          </Tab>
        )}
      </Tabs>
    );
  },
);

SectionWorkQueue.displayName = 'SectionWorkQueue';
