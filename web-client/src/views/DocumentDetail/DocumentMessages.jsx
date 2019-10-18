import { CompletedMessages } from './CompletedMessages';
import { PendingMessages } from './PendingMessages';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import React from 'react';

export const DocumentMessages = connect(
  {},
  () => {
    return (
      <Tabs
        boxed
        bind="documentDetail.messagesTab"
        className="container-tabs no-full-border-bottom tab-button-h3"
        id="case-detail-messages-tabs"
      >
        <Tab
          id="tab-messages-in-progress"
          tabName="inProgress"
          title="In Progress"
        >
          <PendingMessages />
        </Tab>
        <Tab tabName="completed" title="Complete">
          <CompletedMessages />
        </Tab>
      </Tabs>
    );
  },
);
