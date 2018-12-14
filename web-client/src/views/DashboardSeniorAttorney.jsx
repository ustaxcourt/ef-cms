import { connect } from '@cerebral/react';
import React from 'react';

import SuccessNotification from './SuccessNotification';
import ErrorNotification from './ErrorNotification';

export default connect(
  {},
  function DashboardSeniorAttorney() {
    return (
      <section className="usa-section usa-grid">
        <h1 tabIndex="-1">Senior Attorney Dashboard</h1>
        <SuccessNotification />
        <ErrorNotification />
      </section>
    );
  },
);
