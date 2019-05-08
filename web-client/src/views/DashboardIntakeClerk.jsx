import { ErrorNotification } from './ErrorNotification';
import { SuccessNotification } from './SuccessNotification';
import React from 'react';

export const DashboardIntakeClerk = () => (
  <section className="usa-section grid-container">
    <h1 tabIndex="-1">Intake Clerk Dashboard</h1>
    <SuccessNotification />
    <ErrorNotification />
  </section>
);
