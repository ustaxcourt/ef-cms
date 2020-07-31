import { ErrorNotification } from './ErrorNotification';
import { HeaderDashboardInternal } from './Dashboards/HeaderDashboardInternal';
import { IndividualWorkQueue } from './WorkQueue/IndividualWorkQueue';
import { SectionWorkQueue } from './WorkQueue/SectionWorkQueue';
import { SuccessNotification } from './SuccessNotification';
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
        <HeaderDashboardInternal />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          {workQueueHelper.showIndividualWorkQueue && <IndividualWorkQueue />}

          {workQueueHelper.showSectionWorkQueue && <SectionWorkQueue />}
        </section>
      </React.Fragment>
    );
  },
);
