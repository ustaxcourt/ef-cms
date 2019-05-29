import { ErrorNotification } from './ErrorNotification';
import { SuccessNotification } from './SuccessNotification';
import React from 'react';

export const DashboardPublic = () => (
  <section className="usa-section grid-container">
    <h1 tabIndex="-1">Public Dashboard</h1>
    <SuccessNotification />
    <ErrorNotification />
  </section>
);
