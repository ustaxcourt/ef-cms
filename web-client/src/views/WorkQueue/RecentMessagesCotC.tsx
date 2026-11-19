import { Button } from '../../ustc-ui/Button/Button';
import { ClerkOfCourtSectionStatus } from '../Dashboards/ClerkOfCourtSectionStatus';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { RecentMessagesInboxCotCDashboard } from './RecentMessagesInboxCotCDashboard';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const RecentMessagesCotC = connect(
  {
    messagesStatus: state.clerkOfCourtDashboardMessagesStatus,
  },
  function RecentMessagesCotC({ messagesStatus }) {
    return (
      <div>
        <NonMobile>
          <div className="text-right margin-bottom-2">
            <Button link href="/messages/my/inbox" overrideMargin="margin-0">
              View All Messages
            </Button>
          </div>
        </NonMobile>
        <Mobile>
          <div className="margin-bottom-2">
            <Button link href="/messages/my/inbox" overrideMargin="margin-0">
              View All Messages
            </Button>
          </div>
        </Mobile>
        <ClerkOfCourtSectionStatus label="messages" status={messagesStatus}>
          <NonMobile>
            <RecentMessagesInboxCotCDashboard />
          </NonMobile>
          <Mobile>
            <div className="recent-messages-table-mobile-wrapper">
              <RecentMessagesInboxCotCDashboard />
            </div>
          </Mobile>
        </ClerkOfCourtSectionStatus>
      </div>
    );
  },
);

RecentMessagesCotC.displayName = 'RecentMessagesCotC';
