import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const ReadOnlyBanner = connect(
  {
    readOnlyMode: state.readOnlyMode,
  },
  function ReadOnlyBanner({ readOnlyMode }) {
    if (!readOnlyMode) return null;

    return (
      <div className="read-only-banner">
        <div className="grid-container text-bold">
          <FontAwesomeIcon
            className="margin-right-1"
            icon="warning"
            size="1x"
          />
          We are performing maintenance. During this time, you cannot submit
          filings or edit information. Normal operations will resume shortly.
        </div>
      </div>
    );
  },
);
