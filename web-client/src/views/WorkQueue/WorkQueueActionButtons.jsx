import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
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
