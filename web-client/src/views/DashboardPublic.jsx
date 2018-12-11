import { connect } from '@cerebral/react';
import React from 'react';

import SuccessNotification from './SuccessNotification';
import ErrorNotification from './ErrorNotification';

export default connect(
  {},
  function Dashboard() {
    return (
      <section className="usa-section usa-grid">
        <h1 tabIndex="-1">Public Dashboard</h1>
        <SuccessNotification />
        <ErrorNotification />
        <p>
          <a href="log-in">Log in</a>
        </p>
      </section>
    );
  },
);
