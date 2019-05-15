import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { props, state } from 'cerebral';
import React from 'react';

export const Email = connect(
  {
    email: state[props.bind].email,
  },
  ({ email }) => {
    return (
      <React.Fragment>
        <div className="usa-form-group">
          <div className="grid-row grid-gap">
            <div className="mobile-lg:grid-col-7 push-right">
              <div
                id="change-email-hint"
                className="alert-gold add-bottom-margin"
              >
                <span className="usa-form-hint ustc-form-hint-with-svg">
                  <FontAwesomeIcon
                    icon={['far', 'arrow-alt-circle-left']}
                    className="fa-icon-gold"
                    size="sm"
                  />
                  To change your email, go to your Account Settings.
                </span>
              </div>
            </div>
            <div className="mobile-lg:grid-col-5 email-input">
              <label htmlFor="email" className="usa-label">
                Email Address
              </label>
              {email}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  },
);
