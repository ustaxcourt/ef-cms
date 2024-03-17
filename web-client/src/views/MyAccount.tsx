import { BigHeader } from './BigHeader';
import { ErrorNotification } from './ErrorNotification';
import { Hint } from '../ustc-ui/Hint/Hint';
import { LoginAndServiceEmailAddress } from './LoginAndServiceEmailAddress';
import { MyContactInformation } from './MyContactInformation';
import { SuccessNotification } from './SuccessNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const MyAccount = connect(
  { myAccountHelper: state.myAccountHelper },
  function MyAccount({ myAccountHelper }) {
    return (
      <>
        <BigHeader text="My Account" />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />

          {myAccountHelper.showPetitionerView && (
            <Hint>
              You can change other contact information within an individual
              case.
            </Hint>
          )}
          <div
            className={classNames(
              'grid-container padding-x-0',
              myAccountHelper.showPetitionerView && ' margin-top-2',
            )}
          >
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

MyAccount.displayName = 'MyAccount';
