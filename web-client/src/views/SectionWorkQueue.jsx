import { SectionWorkQueueInbox } from './SectionWorkQueueInbox';
import { SectionWorkQueueOutbox } from './SectionWorkQueueOutbox';
import { Tab, Tabs } from '../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SectionWorkQueue = connect(
  {
    chooseWorkQueueSequence: sequences.chooseWorkQueueSequence,
    workQueueHelper: state.workQueueHelper,
  },
  ({ chooseWorkQueueSequence, workQueueHelper }) => {
    return (
      <Tabs
        className="classic-horizontal-header3 tab-border"
        bind="workQueueToDisplay.box"
        onSelect={() => chooseWorkQueueSequence()}
      >
        <Tab tabName="inbox" title="Inbox" id="section-inbox-tab">
          <div id="section-inbox-tab-content">
            <SectionWorkQueueInbox />
          </div>
        </Tab>
        {workQueueHelper.showBatchedForIRSTab && (
          <Tab
            tabName="batched"
            title="Batched for IRS"
            id="section-batched-for-irs-tab"
          >
            <div id="section-batched-for-irs-tab-content">
              <SectionWorkQueueOutbox />
            </div>
          </Tab>
        )}
        <Tab
          tabName="outbox"
          title={workQueueHelper.sentTitle}
          id="section-sent-tab"
        >
          <div id="section-sent-tab-content">
            <SectionWorkQueueOutbox />
          </div>
        </Tab>
      </Tabs>
    );
  },
);
