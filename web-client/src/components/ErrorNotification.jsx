import React from 'react';
import { state } from 'cerebral';

import { connect } from '@cerebral/react';

export default connect(
  {
    isValidPetition: state.petition.isValid,
    alertError: state.alertError,
  },
  function ErrorNotification({ isValidPetition, alertError }) {
    if (!isValidPetition) {
      return <div>is valid? {isValidPetition}</div>;
    }
    return (
      <div className="usa-alert usa-alert-error" role="alert">
        <div className="usa-alert-body">
          <h3 className="usa-alert-heading">Error Status</h3>
          <p className="usa-alert-text">{alertError}</p>
        </div>
      </div>
    );
  },
);
