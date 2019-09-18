import { ErrorNotification } from '../ErrorNotification';
import { HeaderDashboardInternal } from '../Dashboards/HeaderDashboardInternal';
import { SuccessNotification } from '../SuccessNotification';
import { WorkQueue } from '../WorkQueue';
import React from 'react';

export const Messages = () => (
  <>
    <HeaderDashboardInternal />
    <section className="usa-section grid-container">
      <SuccessNotification />
      <ErrorNotification />
      <WorkQueue />
    </section>
  </>
);
