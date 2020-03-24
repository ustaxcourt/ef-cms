import { IndividualWorkQueue } from './WorkQueue/IndividualWorkQueue';
import { SectionWorkQueue } from './WorkQueue/SectionWorkQueue';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const WorkQueue = connect(
  {
    workQueueHelper: state.workQueueHelper,
  },
  function WorkQueue({ workQueueHelper }) {
    return (
      <React.Fragment>
        {workQueueHelper.showIndividualWorkQueue && <IndividualWorkQueue />}

        {workQueueHelper.showSectionWorkQueue && <SectionWorkQueue />}
      </React.Fragment>
    );
  },
);
