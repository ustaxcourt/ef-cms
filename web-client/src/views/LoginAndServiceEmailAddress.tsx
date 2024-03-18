import { Button } from '../ustc-ui/Button/Button';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const LoginAndServiceEmailAddress = connect(
  {
    navigateToPathSequence: sequences.navigateToPathSequence,
    user: state.user,
  },
  function LoginAndServiceEmailAddress({ navigateToPathSequence, user }) {
    return (
      <div className="card">
        <div className="content-wrapper gray" data-testid="user-service-email">
          <h3>Login & Service Email Address</h3>
          <hr />
          {user.email}
          <p className="margin-bottom-0">
            <Button
              link
              className="text-left"
              data-testid="change-email-button"
              icon="edit"
              onClick={() =>
                navigateToPathSequence({
                  path: '/change-login-and-service-email',
                })
              }
            >
              Change Email
            </Button>
          </p>
        </div>
      </div>
    );
  },
);

LoginAndServiceEmailAddress.displayName = 'LoginAndServiceEmailAddress';
