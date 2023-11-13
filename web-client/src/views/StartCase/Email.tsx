import { Hint } from '../../ustc-ui/Hint/Hint';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const Email = connect(
  {
    email: state[props.bind].email,
  },
  function Email({ email }) {
    return (
      <React.Fragment>
        <div className="grid-row grid-gap">
          <div className="mobile-lg:grid-col-7 push-right">
            <Hint>To change your email, go to your Account Settings.</Hint>
          </div>
          <div className="mobile-lg:grid-col-5 email-input margin-bottom-4">
            <label className="usa-label" htmlFor="email">
              Email Address
            </label>
            {email}
          </div>
        </div>
      </React.Fragment>
    );
  },
);

Email.displayName = 'Email';
