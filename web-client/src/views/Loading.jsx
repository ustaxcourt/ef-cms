import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const Loading = connect(
  {
    loadingHelper: state.loadingHelper,
    waitingForResponse: state.waitingForResponse,
  },
  ({ loadingHelper, waitingForResponse }) => {
    return (
      !loadingHelper.pageIsInterstitial &&
      waitingForResponse && (
        <div
          aria-live="assertive"
          className="loading-overlay progress-indicator"
        >
          <FontAwesomeIcon className="fa-spin spinner" icon="sync" size="6x" />
        </div>
      )
    );
  },
);
