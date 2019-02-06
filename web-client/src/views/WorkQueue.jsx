import { connect } from '@cerebral/react';
import React from 'react';
import { state, sequences } from 'cerebral';
import SectionWorkQueue from './SectionWorkQueue';
import IndividualWorkQueue from './IndividualWorkQueue';

export default connect(
  {
    chooseWorkQueueSequence: sequences.chooseWorkQueueSequence,
    workQueueHelper: state.workQueueHelper,
  },
  function WorkQueue({ chooseWorkQueueSequence, workQueueHelper }) {
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
            <li
              className={workQueueHelper.showSectionWorkQueue ? 'active' : ''}
            >
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

        {workQueueHelper.showIndividualWorkQueue && (
          <div role="tabpanel" id="tab-individual-panel">
            <IndividualWorkQueue />
          </div>
        )}
        {workQueueHelper.showSectionWorkQueue && (
          <div role="tabpanel" id="tab-section-panel">
            <SectionWorkQueue />
          </div>
        )}
      </React.Fragment>
    );
  },
);
