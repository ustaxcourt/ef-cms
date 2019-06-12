import { BigHeader } from '../BigHeader';
import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import React from 'react';

export const SessionDetail = () => (
  <>
    <BigHeader text="Session Information" />
    <section className="usa-section grid-container">
      <SuccessNotification />
      <ErrorNotification />

      <div>Session Info Goes Here</div>
    </section>
  </>
);
