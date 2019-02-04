import { connect } from '@cerebral/react';
import React from 'react';
import { state, sequences } from 'cerebral';
import IndividualWorkQueueInbox from './IndividualWorkQueueInbox';
import IndividualWorkQueueOutbox from './IndividualWorkQueueOutbox';

export default connect(
  {
    switchWorkQueueSequence: sequences.switchWorkQueueSequence,
    workQueueHelper: state.workQueueHelper,
  },
  function IndividualWorkQueue({ switchWorkQueueSequence, workQueueHelper }) {
    return (
      <React.Fragment>
        <div role="tablist" className="queue-tab-container">
          <button
            aria-controls="individual-inbox-tab-content"
            aria-selected={workQueueHelper.selectedInbox}
            className="tab-link queue-tab"
            id="individual-inbox-tab"
            role="tab"
            onClick={() =>
              switchWorkQueueSequence({
                queue: 'my',
                box: 'inbox',
              })
            }
          >
            Inbox
          </button>
          <button
            aria-controls="individual-sent-tab-content"
            aria-selected={workQueueHelper.selectedOutbox}
            className="tab-link queue-tab"
            id="individual-sent-tab"
            role="tab"
            onClick={() =>
              switchWorkQueueSequence({
                queue: 'my',
                box: 'outbox',
              })
            }
          >
            Sent
          </button>
        </div>
        {workQueueHelper.selectedInbox && (
          <div role="tabpanel" id="individual-inbox-tab-content">
            <IndividualWorkQueueInbox />
          </div>
        )}
        {workQueueHelper.selectedOutbox && (
          <div role="tabpanel" id="individual-sent-tab-content">
            <IndividualWorkQueueOutbox />
          </div>
        )}
      </React.Fragment>
    );
  },
);
