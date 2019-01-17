import { connect } from '@cerebral/react';
import React from 'react';

import SuccessNotification from './SuccessNotification';
import ErrorNotification from './ErrorNotification';
import WorkQueue from './WorkQueue';

export default connect(
  {},
  function DashboardPetitionsClerkClerk() {
    return (
      <section className="usa-section usa-grid">
        <SuccessNotification />
        <ErrorNotification />
        <WorkQueue />
      </section>
    );
  },
);
