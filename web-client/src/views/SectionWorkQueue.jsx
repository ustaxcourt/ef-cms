import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

import { SectionWorkQueueOutbox } from './SectionWorkQueueOutbox';
import { SectionWorkQueueInbox } from './SectionWorkQueueInbox';

export const SectionWorkQueue = connect(
  {
    chooseWorkQueueSequence: sequences.chooseWorkQueueSequence,
    workQueueHelper: state.workQueueHelper,
  },
  ({ chooseWorkQueueSequence, workQueueHelper }) => {
    return (
      <React.Fragment>
        <div role="tablist" className="queue-tab-container">
          <button
            aria-controls="section-inbox-tab-content"
            aria-selected={workQueueHelper.showInbox}
            className="tab-link queue-tab"
            id="section-inbox-tab"
            role="tab"
            onClick={() =>
              chooseWorkQueueSequence({
                box: 'inbox',
                queue: 'section',
              })
            }
          >
            Inbox
          </button>
          <button
            aria-controls="section-sent-tab-content"
            aria-selected={workQueueHelper.showOutbox}
            className="tab-link queue-tab"
            id="section-sent-tab"
            role="tab"
            onClick={() =>
              chooseWorkQueueSequence({
                box: 'outbox',
                queue: 'section',
              })
            }
          >
            Sent
          </button>
        </div>
        {workQueueHelper.showInbox && (
          <div role="tabpanel" id="section-inbox-tab-content">
            <SectionWorkQueueInbox />
          </div>
        )}
        {workQueueHelper.showOutbox && (
          <div role="tabpanel" id="section-sent-tab-content">
            <SectionWorkQueueOutbox />
          </div>
        )}
      </React.Fragment>
    );
  },
);
