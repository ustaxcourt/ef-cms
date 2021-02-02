import { BigHeader } from './BigHeader';
import { ErrorNotification } from './ErrorNotification';
import { LoginAndServiceEmailAddress } from './LoginAndServiceEmailAddress';
import { MyContactInformation } from './MyContactInformation';
import { SuccessNotification } from './SuccessNotification';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const MyAccount = connect(
  { myAccountHelper: state.myAccountHelper },
  function MyAccount({ myAccountHelper }) {
    return (
      <>
        <BigHeader text="My Account" />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />

          <div className="grid-container padding-x-0">
            <div className="grid-row grid-gap">
              {myAccountHelper.showMyContactInformation && (
                <div className="tablet:grid-col-4">
                  <MyContactInformation />
                </div>
              )}
              <div className="tablet:grid-col-4">
                <LoginAndServiceEmailAddress />
              </div>
            </div>
          </div>
        </section>
      </>
    );
  },
);
