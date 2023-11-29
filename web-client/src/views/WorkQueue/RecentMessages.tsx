import { Button } from '../../ustc-ui/Button/Button';
import { RecentMessagesInbox } from './RecentMessagesInbox';
import React from 'react';

export const RecentMessages = () => {
  return (
    <div className="margin-top-6">
      <Button
        link
        className="float-right"
        href="/messages/my/inbox"
        overrideMargin="margin-0"
      >
        View All Messages
      </Button>

      <RecentMessagesInbox />
    </div>
  );
};

RecentMessages.displayName = 'RecentMessages';
