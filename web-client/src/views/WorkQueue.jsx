import { If } from '../ustc-ui/If/If';
import { IndividualWorkQueue } from './IndividualWorkQueue';
import { SectionWorkQueue } from './SectionWorkQueue';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const WorkQueue = connect(
  {
    runBatchProcessSequence: sequences.runBatchProcessSequence,
    workQueueHelper: state.workQueueHelper,
  },
  ({ runBatchProcessSequence, workQueueHelper }) => {
    return (
      <React.Fragment>
        {workQueueHelper.showIndividualWorkQueue && <IndividualWorkQueue />}

        {workQueueHelper.showSectionWorkQueue && <SectionWorkQueue />}

        {workQueueHelper.showStartCaseButton && (
          <div className="fix-top-right">
            <a
              className="usa-button align-right"
              href="/start-a-case"
              id="init-file-petition"
            >
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
