import { BigHeader } from './BigHeader';
import { Button } from '../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import React from 'react';

export const EmailVerificationSuccess = connect(
  {},
  function EmailVerificationSuccess() {
    return (
      <>
        <BigHeader text="Your Email Has Been Verified" />
        <section className="usa-section grid-container">
          <div className="grid-container padding-x-0">
            <p>You can now log in with your new email address.</p>
            <Button>Log In</Button>
          </div>
        </section>
      </>
    );
  },
);
