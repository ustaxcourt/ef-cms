import { SectionWorkQueueInProgress } from './SectionWorkQueueInProgress';
import { SectionWorkQueueInbox } from './SectionWorkQueueInbox';
import { SectionWorkQueueOutbox } from './SectionWorkQueueOutbox';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { WorkQueueActionButtons } from './WorkQueueActionButtons';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const SectionWorkQueue = connect(
  {
    navigateToPathSequence: sequences.navigateToPathSequence,
    queue: state.workQueueToDisplay.queue,
    section: state.workQueueToDisplay.section,
    workQueueHelper: state.workQueueHelper,
  },
  function SectionWorkQueue({
    navigateToPathSequence,
    queue,
    section,
    workQueueHelper,
  }) {
    return (
      <Tabs
        bind="workQueueToDisplay.box"
        className="classic-horizontal-header3 tab-border"
        onSelect={box => {
          navigateToPathSequence({
            path: workQueueHelper.documentQCNavigationPath({
              box,
              queue,
              section,
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

SectionWorkQueue.displayName = 'SectionWorkQueue';
