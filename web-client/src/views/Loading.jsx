import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const Loading = connect(
  {
    headerHelper: state.headerHelper,
    waitingForResponse: state.waitingForResponse,
  },
  ({ headerHelper, waitingForResponse }) => {
    return (
      !headerHelper.pageIsInterstitial &&
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
