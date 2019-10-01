import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
            <a
              className="usa-button"
              href="/file-a-petition/step-1"
              id="init-file-petition"
            >
              <FontAwesomeIcon icon="plus-circle" size="1x" />
              Create a Case
            </a>
            <If bind="workQueueHelper.showRunBatchIRSProcessButton">
              <button
                className="usa-button usa-button--outline margin-left-1"
                onClick={() => runBatchProcessSequence()}
              >
                Run IRS Batch Process
              </button>
            </If>
          </div>
        )}
      </React.Fragment>
    );
  },
);
