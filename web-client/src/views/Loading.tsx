import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const Loading = connect(
  {
    loadingHelper: state.loadingHelper,
    waitText: state.progressIndicator.waitText,
    waitingForResponse: state.progressIndicator.waitingForResponse,
  },
  function Loading({ loadingHelper, waitingForResponse, waitText }) {
    return (
      !loadingHelper.pageIsInterstitial &&
      waitingForResponse && (
        <div
          aria-label="please wait"
          aria-live="polite"
          className={classNames('loading-overlay', 'progress-indicator', {
            'show-wait-text': waitText,
          })}
        >
          <FontAwesomeIcon className="fa-spin spinner" icon="sync" size="6x" />
          {waitText && <div>{waitText}</div>}
        </div>
      )
    );
  },
);

Loading.displayName = 'Loading';
