import React from 'react';
import { state } from 'cerebral';
import { connect } from '@cerebral/react';
import spinner from '../images/spinner.svg';

export default connect(
  { submitting: state.submitting },
  function Loading({ submitting }) {
    return (
      submitting && (
        <div className="progress-indicator">
          <img src={spinner} className="spinner" alt="progress indicator" />
          <p>Loading</p>
        </div>
      )
    );
  },
);
