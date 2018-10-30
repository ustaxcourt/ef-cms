import React from 'react';
import { state } from 'cerebral';

import { connect } from '@cerebral/react';

export default connect(
  {
    alertError: state.alertError,
  },
  function ErrorNotification({ alertError }) {
    return (
      <React.Fragment>
        {alertError && (
          <div className="usa-alert usa-alert-error" role="alert">
            <div className="usa-alert-body">
              <h3 className="usa-alert-heading">Error Status</h3>
              <p className="usa-alert-text">{alertError}</p>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  },
);
