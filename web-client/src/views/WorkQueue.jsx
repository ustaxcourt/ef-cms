import { IndividualWorkQueue } from './IndividualWorkQueue';
import { SectionWorkQueue } from './SectionWorkQueue';
import { WorkQueueActionButtons } from './WorkQueue/WorkQueueActionButtons';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const WorkQueue = connect(
  {
    workQueueHelper: state.workQueueHelper,
  },
  ({ workQueueHelper }) => {
    return (
      <React.Fragment>
        {workQueueHelper.showIndividualWorkQueue && <IndividualWorkQueue />}

        {workQueueHelper.showSectionWorkQueue && <SectionWorkQueue />}
      </React.Fragment>
    );
  },
);
