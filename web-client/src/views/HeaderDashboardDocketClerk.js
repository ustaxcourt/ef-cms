import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const HeaderDashboardDocketClerk = connect(
  {
    chooseWorkQueueSequence: sequences.chooseWorkQueueSequence,
    unreadCount: state.notifications.unreadCount,
    workQueueHelper: state.workQueueHelper,
  },
  ({ chooseWorkQueueSequence, unreadCount, workQueueHelper }) => {
    const currentBoxView = workQueueHelper.showInbox ? 'inbox' : 'outbox';
    return (
      <div className="big-blue-header">
        <div className="grid-container">
          <h1 tabIndex="-1">Work Queue</h1>
          <span className="unread" aria-label="undread work item count">
            {unreadCount}
          </span>
          {workQueueHelper.showIndividualWorkQueue && (
            <button
              className="button-switch-box"
              onClick={() => {
                chooseWorkQueueSequence({
                  box: currentBoxView,
                  queue: 'section',
                });
              }}
            >
              <FontAwesomeIcon icon={['far', 'clone']} />
              Switch to Section Messages
            </button>
          )}
          {workQueueHelper.showSectionWorkQueue && (
            <button
              className="button-switch-box"
              onClick={() => {
                chooseWorkQueueSequence({
                  box: currentBoxView,
                  queue: 'my',
                });
              }}
            >
              <FontAwesomeIcon icon={['far', 'clone']} />
              Switch to My Messages
            </button>
          )}
        </div>
      </div>
    );
  },
);
