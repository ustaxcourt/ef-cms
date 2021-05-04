import { Button } from '../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const Interstitial = connect(
  {
    alertHelper: state.alertHelper,
    gotoPublicSearchSequence: sequences.gotoPublicSearchSequence,
    isPublic: state.isPublic,
  },
  function Interstitial({ alertHelper, gotoPublicSearchSequence, isPublic }) {
    return (
      <>
        {alertHelper.showErrorAlert && (
          <>
            <div className="big-blue-header">
              <div className="grid-container">
                <div className="grid-row">
                  <div className="tablet:grid-col-6">
                    <h1 className="captioned" tabIndex="-1">
                      {alertHelper.responseCode &&
                        `Error  ${alertHelper.responseCode}`}
                      {!alertHelper.responseCode && 'Error'}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            <section className="usa-section grid-container">
              <h1 tabIndex="-1">We’re experiencing technical problems</h1>
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
          <>
            <div
              aria-label="please wait"
              aria-live="assertive"
              className="progress-indicator"
            >
              <FontAwesomeIcon
                className="fa-spin spinner"
                icon="sync"
                size="6x"
              />
            </div>
          </>
        )}
      </>
    );
  },
);
