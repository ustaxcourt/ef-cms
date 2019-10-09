import { Button } from '../../ustc-ui/Button/Button';
import { If } from '../../ustc-ui/If/If';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const WorkQueueActionButtons = connect(
  {
    runBatchProcessSequence: sequences.runBatchProcessSequence,
    workQueueHelper: state.workQueueHelper,
  },
  ({ runBatchProcessSequence, workQueueHelper }) => {
    return (
      <React.Fragment>
        {workQueueHelper.showStartCaseButton && (
          <div className="ustc-ui-tabs ustc-ui-tabs--right-button-container">
            <Button
              href="/file-a-petition/step-1"
              icon="plus-circle"
              id="init-file-petition"
            >
              Create a Case
            </Button>
            <If bind="workQueueHelper.showRunBatchIRSProcessButton">
              <Button secondary onClick={() => runBatchProcessSequence()}>
                Run IRS Batch Process
              </Button>
            </If>
          </div>
        )}
      </React.Fragment>
    );
  },
);
