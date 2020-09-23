import { IndividualWorkQueueInProgress } from './IndividualWorkQueueInProgress';
import { IndividualWorkQueueInbox } from './IndividualWorkQueueInbox';
import { IndividualWorkQueueOutbox } from './IndividualWorkQueueOutbox';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { WorkQueueActionButtons } from './WorkQueueActionButtons';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const IndividualWorkQueue = connect(
  {
    navigateToPathSequence: sequences.navigateToPathSequence,
    queue: state.workQueueToDisplay.queue,
    workQueueHelper: state.workQueueHelper,
  },
  function IndividualWorkQueue({
    navigateToPathSequence,
    queue,
    workQueueHelper,
  }) {
    return (
      <Tabs
        bind="workQueueToDisplay.box"
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
          id="individual-inbox-tab"
          tabName="inbox"
          title={`Inbox (${workQueueHelper.individualInboxCount})`}
        >
          <div id="individual-inbox-tab-content">
            <IndividualWorkQueueInbox />
          </div>
        </Tab>
        {workQueueHelper.showInProgressTab && (
          <Tab
            id="section-in-progress-tab"
            tabName="inProgress"
            title={`In Progress (${workQueueHelper.individualInProgressCount})`}
          >
            <div id="section-in-progress-tab-content">
              <IndividualWorkQueueInProgress />
            </div>
          </Tab>
        )}
        <Tab
          id="individual-sent-tab"
          tabName="outbox"
          title={workQueueHelper.sentTitle}
        >
          <div id="individual-sent-tab-content">
            <IndividualWorkQueueOutbox />
          </div>
        </Tab>
      </Tabs>
    );
  },
);
