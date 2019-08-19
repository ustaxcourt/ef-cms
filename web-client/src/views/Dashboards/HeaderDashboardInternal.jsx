import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const HeaderDashboardInternal = connect(
  {
    navigateToPathSequence: sequences.navigateToPathSequence,
    workQueueHelper: state.workQueueHelper,
  },
  ({ navigateToPathSequence, workQueueHelper }) => {
    return (
      <div className="big-blue-header">
        <div className="grid-container">
          <h1 tabIndex="-1">{workQueueHelper.workQueueTitle}</h1>
          <span
            aria-label="unread work item count"
            className="unread margin-right-2"
          >
            {workQueueHelper.inboxCount}
          </span>
          {workQueueHelper.showIndividualWorkQueue && (
            <button
              className="button-switch-box usa-button usa-button--unstyled"
              onClick={() => {
                navigateToPathSequence({
                  path: workQueueHelper.getQueuePath({
                    box: workQueueHelper.currentBoxView,
                    queue: 'section',
                  }),
                });
              }}
            >
              <FontAwesomeIcon icon={['far', 'clone']} />
              Switch to Section {workQueueHelper.workQueueType}
            </button>
          )}
          {workQueueHelper.showSectionWorkQueue &&
            workQueueHelper.showMyQueueToggle && (
              <button
                className="button-switch-box usa-button usa-button--unstyled"
                onClick={() => {
                  navigateToPathSequence({
                    path: workQueueHelper.getQueuePath({
                      box: workQueueHelper.currentBoxView,
                      queue: 'my',
                    }),
                  });
                }}
              >
                <FontAwesomeIcon icon={['far', 'clone']} />
                Switch to My {workQueueHelper.workQueueType}
              </button>
            )}
        </div>
      </div>
    );
  },
);
