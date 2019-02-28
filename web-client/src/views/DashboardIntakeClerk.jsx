import React from 'react';

import { ErrorNotification } from './ErrorNotification';
import { SuccessNotification } from './SuccessNotification';

export const DashboardIntakeClerk = () => (
  <section className="usa-section usa-grid">
    <h1 tabIndex="-1">Intake Clerk Dashboard</h1>
    <SuccessNotification />
    <ErrorNotification />
  </section>
);
