import { Button } from '../../ustc-ui/Button/Button';
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
            <Button
              link
              className="button-switch-box"
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
            </Button>
          )}
          {workQueueHelper.showSectionWorkQueue &&
            workQueueHelper.showMyQueueToggle && (
              <Button
                link
                className="button-switch-box"
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
              </Button>
            )}
        </div>
      </div>
    );
  },
);
