import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export default connect(
  {
    alertSuccess: state.alertSuccess,
  },
  function SuccessNotification({ alertSuccess }) {
    return (
      <React.Fragment>
        {alertSuccess && (
          <div
            className="usa-alert usa-alert-success"
            aria-live="polite"
            role="alert"
          >
            <div className="usa-alert-body">
              <h3 className="usa-alert-heading">{alertSuccess.title}</h3>
              <p className="usa-alert-text">{alertSuccess.message}</p>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  },
);
