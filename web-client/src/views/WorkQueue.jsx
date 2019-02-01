import { connect } from '@cerebral/react';
import React from 'react';
import { state, sequences } from 'cerebral';
import SectionWorkQueue from './SectionWorkQueue';
import IndividualWorkQueue from './IndividualWorkQueue';

export default connect(
  {
    switchWorkQueueSequence: sequences.switchWorkQueueSequence,
    workQueueHelper: state.workQueueHelper,
  },
  function WorkQueue({ switchWorkQueueSequence, workQueueHelper }) {
    return (
      <React.Fragment>
        <h1 tabIndex="-1">Work Queue</h1>
        <nav className="horizontal-tabs subsection">
          <ul role="tablist">
            <li
              className={
                workQueueHelper.showIndividualWorkQueue ? 'active' : ''
              }
            >
              <button
                role="tab"
                className="tab-link"
                id="tab-my-queue"
                aria-selected={workQueueHelper.showIndividualWorkQueue}
                onClick={() =>
                  switchWorkQueueSequence({
                    queue: 'my',
                    box: 'inbox',
                  })
                }
              >
                My Queue
              </button>
            </li>
            <li
              className={workQueueHelper.showSectionWorkQueue ? 'active' : ''}
            >
              <button
                role="tab"
                className="tab-link"
                id="tab-work-queue"
                aria-selected={workQueueHelper.showSectionWorkQueue}
                onClick={() =>
                  switchWorkQueueSequence({
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
        <div className="work-queue-tab-container">
          <h3 className="work-queue-tab">Inbox</h3>
        </div>
        {workQueueHelper.showSectionWorkQueue && (
          <div role="tabpanel">
            <SectionWorkQueue />
          </div>
        )}
        {workQueueHelper.showIndividualWorkQueue && (
          <div role="tabpanel">
            <IndividualWorkQueue />
          </div>
        )}
      </React.Fragment>
    );
  },
);
