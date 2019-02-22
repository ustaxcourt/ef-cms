import { connect } from '@cerebral/react';
import React from 'react';

import ErrorNotification from './ErrorNotification';
import SuccessNotification from './SuccessNotification';
import WorkQueue from './WorkQueue';

export const DashboardPetitionsClerkClerk = connect(
  {},
  () => {
    return (
      <section className="usa-section usa-grid">
        <SuccessNotification />
        <ErrorNotification />
        <WorkQueue />
      </section>
    );
  },
);
