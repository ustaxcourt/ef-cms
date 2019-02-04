import { connect } from '@cerebral/react';
import React from 'react';
import { state, sequences } from 'cerebral';
import SectionWorkQueueOutbox from './SectionWorkQueueOutbox';
import SectionWorkQueueInbox from './SectionWorkQueueInbox';

export default connect(
  {
    switchWorkQueueSequence: sequences.switchWorkQueueSequence,
    workQueueHelper: state.workQueueHelper,
  },
  function SectionWorkQueue({ switchWorkQueueSequence, workQueueHelper }) {
    return (
      <React.Fragment>
        <div role="tablist" className="queue-tab-container">
          <button
            aria-controls="section-inbox-tab-content"
            aria-selected={workQueueHelper.selectedInbox}
            className="tab-link queue-tab"
            id="section-inbox-tab"
            role="tab"
            onClick={() =>
              switchWorkQueueSequence({
                queue: 'section',
                box: 'inbox',
              })
            }
          >
            Inbox
          </button>
          <button
            aria-controls="section-sent-tab-content"
            aria-selected={workQueueHelper.selectedOutbox}
            className="tab-link queue-tab"
            id="section-sent-tab"
            role="tab"
            onClick={() =>
              switchWorkQueueSequence({
                queue: 'section',
                box: 'outbox',
              })
            }
          >
            Sent
          </button>
        </div>
        {workQueueHelper.selectedInbox && (
          <div role="tabpanel" id="section-inbox-tab-content">
            <SectionWorkQueueInbox />
          </div>
        )}
        {workQueueHelper.selectedOutbox && (
          <div role="tabpanel" id="section-sent-tab-content">
            <SectionWorkQueueOutbox />
          </div>
        )}
      </React.Fragment>
    );
  },
);
