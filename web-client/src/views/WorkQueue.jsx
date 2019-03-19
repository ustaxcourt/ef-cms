import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

import { Tab, Tabs } from '../ustc-ui/Tabs/Tabs';
import { IndividualWorkQueue } from './IndividualWorkQueue';
import { SectionWorkQueue } from './SectionWorkQueue';

export const WorkQueue = connect(
  {
    chooseWorkQueueSequence: sequences.chooseWorkQueueSequence,
    runBatchProcessSequence: sequences.runBatchProcessSequence,
    workQueueHelper: state.workQueueHelper,
  },
  ({ chooseWorkQueueSequence, runBatchProcessSequence, workQueueHelper }) => {
    return (
      <React.Fragment>
        <h1 tabIndex="-1">Work Queue</h1>
        <Tabs
          className="classic-horizontal"
          defaultActiveTab="my"
          bind="workQueueToDisplay.queue"
          onSelect={() =>
            chooseWorkQueueSequence({
              box: 'inbox',
            })
          }
        >
          <Tab tabName="my" title="My Queue" id="tab-my-queue">
            <div id="tab-individual-panel">
              <IndividualWorkQueue />
            </div>
          </Tab>
          <Tab tabName="section" title="Section Queue" id="tab-work-queue">
            <div id="tab-section-panel">
              <SectionWorkQueue />
            </div>
          </Tab>
        </Tabs>
        {workQueueHelper.showRunBatchIRSProcessButton && (
          <button
            className="usa-button-secondary"
            onClick={() => runBatchProcessSequence()}
          >
            Run IRS Batch Process
          </button>
        )}
      </React.Fragment>
    );
  },
);
