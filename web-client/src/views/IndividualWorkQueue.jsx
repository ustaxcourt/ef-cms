import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';
import { Tab, Tabs } from '../ustc-ui/Tabs/Tabs';

import { IndividualWorkQueueInbox } from './IndividualWorkQueueInbox';
import { IndividualWorkQueueOutbox } from './IndividualWorkQueueOutbox';

export const IndividualWorkQueue = connect(
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
        <Tab tabName="inbox" title="Inbox" id="individual-inbox-tab">
          <div id="individual-inbox-tab-content">
            <IndividualWorkQueueInbox />
          </div>
        </Tab>
        <Tab tabName="outbox" title="Sent" id="individual-sent-tab">
          <div id="individual-sent-tab-content">
            <IndividualWorkQueueOutbox />
          </div>
        </Tab>
      </Tabs>
    );
  },
);
