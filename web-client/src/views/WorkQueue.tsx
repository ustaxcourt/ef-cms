import { ErrorNotification } from './ErrorNotification';
import { HeaderDashboardInternal } from './Dashboards/HeaderDashboardInternal';
import { IndividualWorkQueue } from './WorkQueue/IndividualWorkQueue';
import { SectionWorkQueue } from './WorkQueue/SectionWorkQueue';
import { SuccessNotification } from './SuccessNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
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

WorkQueue.displayName = 'WorkQueue';
