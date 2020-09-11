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
  function HeaderDashboardInternal({
    navigateToPathSequence,
    workQueueHelper,
  }) {
    return (
      <div className="big-blue-header">
        <div className="grid-container">
          <h1 tabIndex="-1">{workQueueHelper.workQueueTitle}</h1>
          <span
            aria-label="unread work item count"
            className="unread margin-right-2"
          ></span>
          {workQueueHelper.showIndividualWorkQueue && (
            <Button
              link
              className="button-switch-box"
              onClick={() => {
                navigateToPathSequence({
                  path: workQueueHelper.getQueuePath({
                    box: 'inbox',
                    queue: 'section',
                  }),
                });
              }}
            >
              <FontAwesomeIcon icon={['far', 'clone']} />
              Switch to Section Document QC
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
                      box: 'inbox',
                      queue: 'my',
                    }),
                  });
                }}
              >
                <FontAwesomeIcon icon={['far', 'clone']} />
                Switch to My Document QC
              </Button>
            )}
        </div>
      </div>
    );
  },
);
