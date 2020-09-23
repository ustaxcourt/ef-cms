import { SectionWorkQueueInProgress } from './SectionWorkQueueInProgress';
import { SectionWorkQueueInbox } from './SectionWorkQueueInbox';
import { SectionWorkQueueOutbox } from './SectionWorkQueueOutbox';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { WorkQueueActionButtons } from './WorkQueueActionButtons';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SectionWorkQueue = connect(
  {
    navigateToPathSequence: sequences.navigateToPathSequence,
    queue: state.workQueueToDisplay.queue,
    workQueueHelper: state.workQueueHelper,
  },
  function SectionWorkQueue({
    navigateToPathSequence,
    queue,
    workQueueHelper,
  }) {
    return (
      <Tabs
        bind="workQueueToDisplay.box"
        className="classic-horizontal-header3 tab-border"
        onSelect={box => {
          navigateToPathSequence({
            path: workQueueHelper.getQueuePath({
              box,
              queue,
            }),
          });
        }}
      >
        <WorkQueueActionButtons />

        <Tab
          id="section-inbox-tab"
          tabName="inbox"
          title={`Inbox (${workQueueHelper.sectionInboxCount})`}
        >
          <div id="section-inbox-tab-content">
            <SectionWorkQueueInbox />
          </div>
        </Tab>
        {workQueueHelper.showInProgressTab && (
          <Tab
            id="section-in-progress-tab"
            tabName="inProgress"
            title={`In Progress (${workQueueHelper.sectionInProgressCount})`}
          >
            <div id="section-in-progress-tab-content">
              <SectionWorkQueueInProgress />
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
              <SectionWorkQueueOutbox />
            </div>
          </Tab>
        )}
      </Tabs>
    );
  },
);
