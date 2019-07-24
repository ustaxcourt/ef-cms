import { ErrorNotification } from './ErrorNotification';
import { HeaderDashboardInternal } from './HeaderDashboardInternal';
import { SuccessNotification } from './SuccessNotification';
import { WorkQueue } from './WorkQueue';
import React from 'react';

export const DashboardSeniorAttorney = () => (
  <>
    <HeaderDashboardInternal />
    <section className="usa-section grid-container">
      <SuccessNotification />
      <ErrorNotification />
      <WorkQueue />
    </section>
  </>
);
