import { BigHeader } from '../BigHeader';
import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import React from 'react';

export const CreateOrder = connect(
  {},
  () => {
    return (
      <>
        <BigHeader text="Create Order" />
        <section className="usa-section grid-container DocumentDetail">
          <h2 className="heading-1">A Header</h2>
          <SuccessNotification />
          <ErrorNotification />

          <div className="blue-container">Editor goes here</div>
        </section>
      </>
    );
  },
);
