import { Button } from '../../ustc-ui/Button/Button';
import React from 'react';
import { RecentMessagesInboxCotCDashboard } from './RecentMessagesInboxCotCDashboard';

export const RecentMessagesCotC = () => {
  return (
    <div>
      <Button
        link
        className="float-right"
        href="/messages/my/inbox"
        overrideMargin="margin-0"
      >
        View All Messages
      </Button>
      <RecentMessagesInboxCotCDashboard />
    </div>
  );
};

RecentMessagesCotC.displayName = 'RecentMessagesCotC';
