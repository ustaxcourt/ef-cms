import React from 'react';

import { SuccessNotification } from './SuccessNotification';
import { ErrorNotification } from './ErrorNotification';

export const DashboardPublic = () => (
  <section className="usa-section usa-grid">
    <h1 tabIndex="-1">Public Dashboard</h1>
    <SuccessNotification />
    <ErrorNotification />
  </section>
);
