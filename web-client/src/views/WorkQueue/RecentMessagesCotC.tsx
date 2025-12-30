import { Button } from '../../ustc-ui/Button/Button';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import React from 'react';
import { RecentMessagesInboxCotCDashboard } from './RecentMessagesInboxCotCDashboard';

export const RecentMessagesCotC = () => {
  return (
    <div>
      <div className="text-right margin-bottom-2">
        <Button link href="/messages/my/inbox" overrideMargin="margin-0">
          View All Messages
        </Button>
      </div>
      <NonMobile>
        <RecentMessagesInboxCotCDashboard />
      </NonMobile>
      <Mobile>
        <div className="recent-messages-table-mobile-wrapper">
          <RecentMessagesInboxCotCDashboard />
        </div>
      </Mobile>
    </div>
  );
};

RecentMessagesCotC.displayName = 'RecentMessagesCotC';
