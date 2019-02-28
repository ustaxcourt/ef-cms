import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export const Email = connect(
  {
    email: state.user.email,
  },
  ({ email }) => {
    return (
      <React.Fragment>
        <div className="usa-form-group">
          <div className="usa-width-five-twelfths">
            <label htmlFor="email">Email Address</label>
            {email}
          </div>
          <div className="usa-width-seven-twelfths">
            <div
              id="change-email-hint"
              className="alert-gold add-bottom-margin"
            >
              <span className="usa-form-hint">
                <FontAwesomeIcon
                  icon={['far', 'arrow-alt-circle-left']}
                  className="fa-icon-gold"
                  size="sm"
                />
                To change your email, go to your Account Settings.
              </span>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  },
);
