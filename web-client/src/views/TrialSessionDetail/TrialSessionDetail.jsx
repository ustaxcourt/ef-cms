import { BigHeader } from '../BigHeader';
import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import React from 'react';

export const TSrialSessionDetail = () => (
  <>
    <BigHeader text="Session Information" />
    <section className="usa-section grid-container">
      <SuccessNotification />
      <ErrorNotification />

      <div>Trial Session Info Goes Here</div>
    </section>
  </>
);
