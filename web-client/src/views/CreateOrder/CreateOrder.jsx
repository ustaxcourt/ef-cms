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

          <div className="grid-container padding-x-0">
            <div className="grid-row grid-gap">
              <div className="grid-col-5">
                <div className="blue-container">Editor goes here</div>
              </div>
              <div className="grid-col-7"></div>
            </div>
          </div>
        </section>
      </>
    );
  },
);
