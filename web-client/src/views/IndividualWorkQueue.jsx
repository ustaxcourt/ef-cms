import { Tab, Tabs } from '../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

import { IndividualWorkQueueInbox } from './IndividualWorkQueueInbox';
import { IndividualWorkQueueOutbox } from './IndividualWorkQueueOutbox';

export const IndividualWorkQueue = connect(
  {
    navigateToPathSequence: sequences.navigateToPathSequence,
    queue: state.workQueueToDisplay.queue,
    workQueueHelper: state.workQueueHelper,
  },
  ({ navigateToPathSequence, queue, workQueueHelper }) => {
    return (
      <Tabs
        bind="workQueueToDisplay.box"
        onSelect={box => {
          navigateToPathSequence({
            path: `/${
              workQueueHelper.workQueueIsInternal ? 'messages' : 'document-qc'
            }/${queue}/${box}`,
          });
        }}
      >
        <Tab tabName="inbox" title="Inbox" id="individual-inbox-tab">
          <div id="individual-inbox-tab-content">
            <IndividualWorkQueueInbox />
          </div>
        </Tab>
        {workQueueHelper.showBatchedForIRSTab && (
          <Tab
            tabName="batched"
            title="Batched for IRS"
            id="section-batched-for-irs-tab"
          >
            <div id="section-batched-for-irs-tab-content">
              <IndividualWorkQueueOutbox />
            </div>
          </Tab>
        )}
        <Tab
          tabName="outbox"
          title={workQueueHelper.sentTitle}
          id="individual-sent-tab"
        >
          <div id="individual-sent-tab-content">
            <IndividualWorkQueueOutbox />
          </div>
        </Tab>
      </Tabs>
    );
  },
);
