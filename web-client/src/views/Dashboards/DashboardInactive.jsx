import { connect } from '@cerebral/react';
import React from 'react';

export const DashboardInactive = connect({}, function DashboardInactive() {
  return (
    <React.Fragment>
      <section className="usa-section grid-container">
        Your user account is inactive.
      </section>
    </React.Fragment>
  );
});
