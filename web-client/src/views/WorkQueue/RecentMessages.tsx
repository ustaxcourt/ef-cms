import { RecentMessagesInbox } from './RecentMessagesInbox';
import React from 'react';

export const RecentMessages = () => {
  return (
    <div className="margin-top-5">
      <RecentMessagesInbox />
    </div>
  );
};

RecentMessages.displayName = 'RecentMessages';
