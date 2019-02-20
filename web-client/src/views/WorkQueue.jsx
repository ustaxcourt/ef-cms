import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

import { WorkQueueTabs } from './WorkQueueTabs';
import IndividualWorkQueue from './IndividualWorkQueue';
import SectionWorkQueue from './SectionWorkQueue';

export default connect(
  {
    workQueueHelper: state.workQueueHelper,
  },
  function WorkQueue({ workQueueHelper }) {
    return (
      <React.Fragment>
        <h1 tabIndex="-1">Work Queue</h1>
        <WorkQueueTabs />
        {workQueueHelper.showIndividualWorkQueue && (
          <div role="tabpanel" id="tab-individual-panel">
            <IndividualWorkQueue />
          </div>
        )}
        {workQueueHelper.showSectionWorkQueue && (
          <div role="tabpanel" id="tab-section-panel">
            <SectionWorkQueue />
          </div>
        )}
      </React.Fragment>
    );
  },
);
