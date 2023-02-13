import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const EmailVerificationInstructions = connect(
  {
    navigateToCognitoSequence: sequences.navigateToCognitoSequence,
  },
  function EmailVerificationInstructions({ navigateToCognitoSequence }) {
    return (
      <>
        <BigHeader text="You Must Be Logged In to Verify Email" />
        <section className="usa-section grid-container">
          <div className="grid-container padding-x-0">
            <ul className="line-height-body-4">
              <li>Login using your old email address</li>
              <li>Check your new email account for our verification email</li>
              <li>
                Click the <b>Verify Email</b> link from your new email
              </li>
            </ul>
            <Button onClick={() => navigateToCognitoSequence()}>Log In</Button>
          </div>
        </section>
      </>
    );
  },
);

EmailVerificationInstructions.displayName = 'EmailVerificationInstructions';
