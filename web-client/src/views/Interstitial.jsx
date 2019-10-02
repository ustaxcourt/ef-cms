import { Button } from '../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const Interstitial = connect(
  {
    alertHelper: state.alertHelper,
  },
  ({ alertHelper }) => {
    return (
      <>
        {alertHelper.showErrorAlert && (
          <section className="usa-section grid-container">
            <h1 tabIndex="-1">We’re experiencing technical problems</h1>
            <h2>Where do you go from here?</h2>
            <p>
              You can return to the previous screen and try again, or visit the
              United States Tax Court website for information on court services
              and contact information.
            </p>
            <Button onClick={() => history.back()}>Back</Button>
          </section>
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
