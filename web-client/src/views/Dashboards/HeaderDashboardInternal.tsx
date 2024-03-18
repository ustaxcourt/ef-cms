import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
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
          <h1 tabIndex={-1}>{workQueueHelper.workQueueTitle}</h1>
          <span
            aria-label="unread work item count"
            className="unread margin-right-2"
          ></span>
          {workQueueHelper.showIndividualWorkQueue &&
            !workQueueHelper.isCaseServicesSupervisor && (
              <Button
                link
                className="button-switch-box"
                data-testid="switch-to-section-document-qc-button"
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
          {workQueueHelper.showSwitchToMyDocQCLink && (
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

HeaderDashboardInternal.displayName = 'HeaderDashboardInternal';
