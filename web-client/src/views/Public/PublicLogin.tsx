import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app-public.cerebral';
import React from 'react';

export const PublicLogin = connect(
  {
    redirectToLoginSequence: sequences.redirectToLoginSequence,
  },
  function PublicLogin({
    redirectToLoginSequence,
  }: {
    redirectToLoginSequence: () => void;
  }) {
    return (
      <>
        <BigHeader text="Log in to DAWSON" />
        <section className="usa-section grid-container">
          <div className="grid-container padding-x-0">
            <ErrorNotification />
            <SuccessNotification />
            <p className="margin-top-3">
              Click the button below to proceed to the login page.
            </p>
            <Button onClick={() => redirectToLoginSequence()}>
              Go to Login
            </Button>
          </div>
        </section>
      </>
    );
  },
);

PublicLogin.displayName = 'PublicLogin';

