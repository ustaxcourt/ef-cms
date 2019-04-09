import { ErrorNotification } from './ErrorNotification';
import { SuccessNotification } from './SuccessNotification';
import React from 'react';

export const DashboardPublic = () => (
  <section className="usa-section usa-grid">
    <h1 tabIndex="-1">Public Dashboard</h1>
    <SuccessNotification />
    <ErrorNotification />
  </section>
);
