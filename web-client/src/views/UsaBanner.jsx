import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import iconDotGov from '../../node_modules/uswds/dist/img/icon-dot-gov.svg';
import iconHttps from '../../node_modules/uswds/dist/img/icon-https.svg';
import usFlag from '../../node_modules/uswds/dist/img/us_flag_small.png';

export const UsaBanner = connect(
  {
    showDetails: state.usaBanner.showDetails,
    toggleUsaBannerDetailsSequence: sequences.toggleUsaBannerDetailsSequence,
  },
  ({ showDetails, toggleUsaBannerDetailsSequence }) => {
    return (
      <section className="site-banner usa-banner">
        <div className="usa-accordion">
          <header className="usa-banner__header">
            <div className="grid-container usa-banner__inner">
              <img
                alt="U.S. flag"
                className="usa-banner__header-flag"
                src={usFlag}
              />
              <p>An official website of the United States government&nbsp;</p>
              <button
                aria-controls="gov-banner"
                aria-expanded={showDetails}
                className="usa-accordion__button usa-banner__button"
                onClick={() => toggleUsaBannerDetailsSequence()}
              >
                <span className="usa-banner__button-text">
                  Here’s how you know&nbsp;
                </span>
              </button>
            </div>
          </header>
          {showDetails && (
            <div
              aria-hidden="false"
              className="usa-banner__content grid-container usa-accordion__content"
              id="gov-banner"
            >
              <div className="grid-row grid-gap-lg">
                <div className="usa-banner__guidance tablet:grid-col-6">
                  <img
                    alt="Dot gov"
                    className="usa-banner__icon usa-media-block__img"
                    src={iconDotGov}
                  />
                  <div className="usa-media-block__body">
                    <p>
                      <strong>The .gov means it’s official.</strong>
                      <br />
                      Federal government websites often end in .gov or .mil.
                      Before sharing sensitive information, make sure you’re on
                      a federal government site.
                    </p>
                  </div>
                </div>
                <div className="usa-banner__guidance tablet:grid-col-6">
                  <img
                    alt="Https"
                    className="usa-banner__icon usa-media-block__img"
                    src={iconHttps}
                  />
                  <div className="usa-media-block__body">
                    <p>
                      <strong>The site is secure.</strong>
                      <br />
                      The <strong>https://</strong> ensures that you are
                      connecting to the official website and that any
                      information you provide is encrypted and transmitted
                      securely.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  },
);
