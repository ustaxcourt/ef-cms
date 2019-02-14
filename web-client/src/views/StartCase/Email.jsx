import { connect } from '@cerebral/react';
import { state, props } from 'cerebral';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export default connect(
  {
    form: state.form,
    type: props.type,
  },
  function Email({ form, type }) {
    return (
      <React.Fragment>
        <div className="usa-form-group">
          <div className="usa-width-five-twelfths">
            <label htmlFor="email">Email Address</label>
            {form[type].email}
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
