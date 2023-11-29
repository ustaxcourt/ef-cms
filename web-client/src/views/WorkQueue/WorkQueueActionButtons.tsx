import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const WorkQueueActionButtons = connect(
  {
    workQueueHelper: state.workQueueHelper,
  },
  function WorkQueueActionButtons({ workQueueHelper }) {
    return (
      <React.Fragment>
        {workQueueHelper.showStartPetitionButton && (
          <div className="ustc-ui-tabs ustc-ui-tabs--right-button-container">
            <Button
              data-testid="start-a-petition"
              href="/file-a-petition/step-1"
              icon="plus-circle"
              id="file-a-petition"
            >
              Start a Petition
            </Button>
          </div>
        )}
      </React.Fragment>
    );
  },
);

WorkQueueActionButtons.displayName = 'WorkQueueActionButtons';
