import { SectionWorkQueueInbox } from './SectionWorkQueueInbox';
import { SectionWorkQueueOutbox } from './SectionWorkQueueOutbox';
import { Tab, Tabs } from '../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const SectionWorkQueue = connect(
  {
    chooseWorkQueueSequence: sequences.chooseWorkQueueSequence,
  },
  ({ chooseWorkQueueSequence }) => {
    return (
      <Tabs
        className="subsection-container-tabs"
        bind="workQueueToDisplay.box"
        onSelect={() => chooseWorkQueueSequence()}
      >
        <Tab tabName="inbox" title="Inbox" id="section-inbox-tab">
          <div id="section-inbox-tab-content">
            <SectionWorkQueueInbox />
          </div>
        </Tab>
        <Tab tabName="outbox" title="Sent" id="section-sent-tab">
          <div id="section-sent-tab-content">
            <SectionWorkQueueOutbox />
          </div>
        </Tab>
      </Tabs>
    );
  },
);
