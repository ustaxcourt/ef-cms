import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const EmailVerificationInstructions = connect(
  {
    gotoLoginSequence: sequences.gotoLoginSequence,
  },
  function EmailVerificationInstructions({ gotoLoginSequence }) {
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
            <Button onClick={() => gotoLoginSequence()}>Log In</Button>
          </div>
        </section>
      </>
    );
  },
);

EmailVerificationInstructions.displayName = 'EmailVerificationInstructions';
