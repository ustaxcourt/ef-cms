import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

import { IndividualWorkQueueInbox } from './IndividualWorkQueueInbox';
import { IndividualWorkQueueOutbox } from './IndividualWorkQueueOutbox';

export const IndividualWorkQueue = connect(
  {
    chooseWorkQueueSequence: sequences.chooseWorkQueueSequence,
    workQueueHelper: state.workQueueHelper,
  },
  ({ chooseWorkQueueSequence, workQueueHelper }) => {
    return (
      <React.Fragment>
        <div role="tablist" className="queue-tab-container">
          <button
            aria-controls="individual-inbox-tab-content"
            aria-selected={workQueueHelper.showInbox}
            className="tab-link queue-tab"
            id="individual-inbox-tab"
            role="tab"
            onClick={() =>
              chooseWorkQueueSequence({
                box: 'inbox',
                queue: 'my',
              })
            }
          >
            Inbox
          </button>
          <button
            aria-controls="individual-sent-tab-content"
            aria-selected={workQueueHelper.showOutbox}
            className="tab-link queue-tab"
            id="individual-sent-tab"
            role="tab"
            onClick={() =>
              chooseWorkQueueSequence({
                box: 'outbox',
                queue: 'my',
              })
            }
          >
            Sent
          </button>
        </div>
        {workQueueHelper.showInbox && (
          <div role="tabpanel" id="individual-inbox-tab-content">
            <IndividualWorkQueueInbox />
          </div>
        )}
        {workQueueHelper.showOutbox && (
          <div role="tabpanel" id="individual-sent-tab-content">
            <IndividualWorkQueueOutbox />
          </div>
        )}
      </React.Fragment>
    );
  },
);
