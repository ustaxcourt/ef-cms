import { connect } from '@cerebral/react';
import { state, sequences } from 'cerebral';
import React from 'react';

export const WorkQueueTabs = connect(
  {
    chooseWorkQueueSequence: sequences.chooseWorkQueueSequence,
    workQueueHelper: state.workQueueHelper,
  },
  function WorkQueueTabs({ chooseWorkQueueSequence, workQueueHelper }) {
    return (
      <nav className="horizontal-tabs subsection">
        <ul role="tablist">
          <li
            className={workQueueHelper.showIndividualWorkQueue ? 'active' : ''}
          >
            <button
              role="tab"
              className="tab-link"
              id="tab-my-queue"
              aria-controls="tab-individual-panel"
              aria-selected={workQueueHelper.showIndividualWorkQueue}
              onClick={() =>
                chooseWorkQueueSequence({
                  queue: 'my',
                  box: 'inbox',
                })
              }
            >
              My Queue
            </button>
          </li>
          <li className={workQueueHelper.showSectionWorkQueue ? 'active' : ''}>
            <button
              role="tab"
              className="tab-link"
              id="tab-work-queue"
              aria-controls="tab-section-panel"
              aria-selected={workQueueHelper.showSectionWorkQueue}
              onClick={() =>
                chooseWorkQueueSequence({
                  queue: 'section',
                  box: 'inbox',
                })
              }
            >
              Section Queue
            </button>
          </li>
        </ul>
      </nav>
    );
  },
);
