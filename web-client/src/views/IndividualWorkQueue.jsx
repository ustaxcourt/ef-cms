import { connect } from '@cerebral/react';
import React from 'react';
import { state, sequences } from 'cerebral';
import IndividualWorkQueueInbox from './IndividualWorkQueueInbox';
import IndividualWorkQueueOutbox from './IndividualWorkQueueOutbox';

export default connect(
  {
    chooseWorkQueueSequence: sequences.chooseWorkQueueSequence,
    workQueueHelper: state.workQueueHelper,
  },
  function IndividualWorkQueue({ chooseWorkQueueSequence, workQueueHelper }) {
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
                queue: 'my',
                box: 'inbox',
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
                queue: 'my',
                box: 'outbox',
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
