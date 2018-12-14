import { connect } from '@cerebral/react';
import React from 'react';

import SuccessNotification from './SuccessNotification';
import ErrorNotification from './ErrorNotification';

export default connect(
  {},
  function DashboardIntakeClerk() {
    return (
      <section className="usa-section usa-grid">
        <h1 tabIndex="-1">Intake Clerk Dashboard</h1>
        <SuccessNotification />
        <ErrorNotification />
      </section>
    );
  },
);
