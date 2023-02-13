import { Button } from '../../ustc-ui/Button/Button';
import { RecentMessagesInbox } from './RecentMessagesInbox';
import React from 'react';

export const RecentMessages = () => {
  return (
    <div className="margin-top-6">
      <h1>
        Recent Messages
        <Button link className="margin-left-205" href="/messages/my/inbox">
          View All Messages
        </Button>
      </h1>

      <RecentMessagesInbox />
    </div>
  );
};

RecentMessages.displayName = 'RecentMessages';
