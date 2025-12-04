import { Button } from '../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app-public.cerebral';
import React from 'react';

const interstitialDeps = {
  alertHelper: state.alertHelper,
  gotoPublicSearchSequence:
    sequences.gotoPublicSearchSequence as unknown as () => void,
  isPublic: state.isPublic,
};

export const Interstitial = connect(
  interstitialDeps,
  function Interstitial({ alertHelper, gotoPublicSearchSequence, isPublic }) {
    return (
      <>
        {alertHelper.showErrorAlert && (
          <>
            <div className="big-blue-header">
              <div className="grid-container">
                <div className="grid-row">
                  <div className="tablet:grid-col-6">
                    <h1 className="captioned" tabIndex={-1}>
                      {alertHelper.responseCode &&
                        `Error  ${alertHelper.responseCode}`}
                      {!alertHelper.responseCode && 'Error'}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            <section className="usa-section grid-container">
              <h1 tabIndex={-1}>We’re experiencing technical problems</h1>
              <h2>Where do you go from here?</h2>
              <p>
                Try again, or contact dawson.support@ustaxcourt.gov for
                assistance.
              </p>
              {!isPublic && (
                <Button onClick={() => history.back()}>
                  Go Back to Try Again
                </Button>
              )}
              {isPublic && (
                <Button
                  onClick={() => {
                    gotoPublicSearchSequence();
                  }}
                >
                  Go Back to Try Again
                </Button>
              )}
            </section>
          </>
        )}
        {!alertHelper.showErrorAlert && (
          <div
            aria-label="please wait"
            aria-live="polite"
            className="loading-overlay progress-indicator"
          >
            <FontAwesomeIcon
              className="fa-spin spinner"
              icon="sync"
              size="6x"
            />
          </div>
        )}
      </>
    );
  },
);

Interstitial.displayName = 'Interstitial';
