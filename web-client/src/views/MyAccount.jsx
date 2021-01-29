import { BigHeader } from './BigHeader';
import { ErrorNotification } from './ErrorNotification';
import { LoginAndServiceEmailAddress } from './LoginAndServiceEmailAddress';
import { MyContactInformation } from './MyContactInformation';
import { SuccessNotification } from './SuccessNotification';
import { connect } from '@cerebral/react';
import React from 'react';

export const MyAccount = connect({}, function MyAccount() {
  return (
    <React.Fragment>
      <BigHeader text={'My Account'} />
      <section className="usa-section grid-container">
        <SuccessNotification />
        <ErrorNotification />

        <div className="grid-container padding-x-0">
          <div className="grid-row grid-gap">
            <div className="grid-col-4">
              <MyContactInformation />
            </div>
            <div className="grid-col-4">
              <LoginAndServiceEmailAddress />
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
});
