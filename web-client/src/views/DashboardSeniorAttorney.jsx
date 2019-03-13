import React from 'react';

import { SuccessNotification } from './SuccessNotification';
import { ErrorNotification } from './ErrorNotification';
import { WorkQueue } from './WorkQueue';

export const DashboardSeniorAttorney = () => (
  <section className="usa-section usa-grid">
    <SuccessNotification />
    <ErrorNotification />
    <WorkQueue />
  </section>
);
