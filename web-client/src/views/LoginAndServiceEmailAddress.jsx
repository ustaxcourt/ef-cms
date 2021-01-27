import { Button } from '../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const LoginAndServiceEmailAddress = connect(
  {
    user: state.user,
  },
  function LoginAndServiceEmailAddress({ user }) {
    return (
      <div className="card">
        <div className="content-wrapper gray">
          <h3>Login & Service Email Address</h3>
          <hr />
          {user.email}
          {/* TODO: get email */}
          <p className="margin-bottom-0">
            <Button
              link
              icon="edit"
              onClick={() => {
                // canEditContactInformationSequence();
              }}
            >
              Change Email
            </Button>
          </p>
        </div>
      </div>
    );
  },
);
