import { state } from 'cerebral';
import React from 'react';

import { connect } from '@cerebral/react';

export default connect(
  {
    alertError: state.alertError,
  },
  function ErrorNotification({ alertError }) {
    return (
      <React.Fragment>
        {alertError && (
          <div
            className="usa-alert usa-alert-error"
            aria-live="assertive"
            role="alert"
          >
            <div className="usa-alert-body">
              <h3 className="usa-alert-heading">{alertError.title}</h3>
              <p className="usa-alert-text">{alertError.message}</p>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  },
);
