import { ErrorNotification } from './ErrorNotification';
import { SuccessNotification } from './SuccessNotification';
import { WorkQueue } from './WorkQueue';
import React from 'react';

export const DashboardPetitionsClerk = () => (
  <section className="usa-section usa-grid">
    <SuccessNotification />
    <ErrorNotification />
    <WorkQueue />
  </section>
);
