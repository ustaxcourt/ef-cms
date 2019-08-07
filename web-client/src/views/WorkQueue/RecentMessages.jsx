import { RecentMessagesInbox } from './RecentMessagesInbox';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import React from 'react';

export const RecentMessages = () => {
  return (
    <Tabs>
      <div className="ustc-ui-tabs ustc-ui-tabs--right-button-container">
        <button className="usa-button--unstyled margin-top-2">
          View All Messages
        </button>
      </div>
      <Tab
        id="recent-messages-tab"
        tabName="recentMessages"
        title="Recent Messages"
      >
        <div id="recent-messages-tab-content">
          <RecentMessagesInbox />
        </div>
      </Tab>
    </Tabs>
  );
};
