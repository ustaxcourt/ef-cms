import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import React from 'react';

export const DashboardJudge = () => (
  <section className="usa-section grid-container">
    <h1 tabIndex="-1">Judge Dashboard</h1>
    <SuccessNotification />
    <ErrorNotification />
  </section>
);
