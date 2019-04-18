import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const Loading = connect(
  { submitting: state.submitting },
  ({ submitting }) => {
    return (
      submitting && (
        <div
          className="loading-overlay progress-indicator"
          aria-live="assertive"
        >
          <FontAwesomeIcon icon="sync" className="fa-spin spinner" size="6x" />
        </div>
      )
    );
  },
);
