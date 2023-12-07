import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const EmailVerificationSuccess = connect(
  {
    gotoLoginSequence: sequences.gotoLoginSequence,
  },
  function EmailVerificationSuccess({ gotoLoginSequence }) {
    return (
      <>
        <BigHeader text="Your Email Has Been Verified" />
        <section className="usa-section grid-container">
          <div className="grid-container padding-x-0">
            <p>You can now log in with your new email address.</p>
            <Button onClick={() => gotoLoginSequence()}>Log In</Button>
          </div>
        </section>
      </>
    );
  },
);

EmailVerificationSuccess.displayName = 'EmailVerificationSuccess';
