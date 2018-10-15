import React from 'react';
import { state, sequences } from 'cerebral';
import { connect } from '@cerebral/react';

import usFlag from '../../node_modules/uswds/dist/img/favicons/favicon-57.png';
import iconDotGov from '../../node_modules/uswds/dist/img/icon-dot-gov.svg';
import iconHttps from '../../node_modules/uswds/dist/img/icon-https.svg';

/**
 * Official US website banner
 */
export default connect(
  {
    showDetails: state.usaBanner.showDetails,
    toggleUsaBannerDetails: sequences.toggleUsaBannerDetails,
  },
  function UsaBanner({ showDetails, toggleUsaBannerDetails }) {
    return (
      <section className="usa-banner">
        <div className="usa-accordion">
          <header className="usa-banner-header">
            <div className="usa-grid usa-banner-inner">
              <img src={usFlag} alt="U.S. flag" />
              <p>An official website of the United States government&nbsp;</p>
              <button
                className="usa-accordion-button usa-banner-button"
                aria-expanded={showDetails}
                aria-controls="gov-banner"
                onClick={() => toggleUsaBannerDetails()}
              >
                <span className="usa-banner-button-text">
                  Here&apos;s how you know&nbsp;
                </span>
              </button>
            </div>
          </header>
          {showDetails && (
            <div
              className="usa-banner-content usa-grid usa-accordion-content"
              id="gov-banner"
              aria-hidden="false"
            >
              <div className="usa-banner-guidance-gov usa-width-one-half">
                <img
                  className="usa-banner-icon usa-media_block-img"
                  src={iconDotGov}
                  alt="Dot gov"
                />
                <div className="usa-media_block-body">
                  <p>
                    <strong>The .gov means it’s official.</strong>
                    <br />
                    Federal government websites often end in .gov or .mil.
                    Before sharing sensitive information, make sure you’re on a
                    federal government site.
                  </p>
                </div>
              </div>
              <div className="usa-banner-guidance-ssl usa-width-one-half">
                <img
                  className="usa-banner-icon usa-media_block-img"
                  src={iconHttps}
                  alt="Https"
                />
                <div className="usa-media_block-body">
                  <p>
                    <strong>The site is secure.</strong>
                    <br />
                    The <strong>https://</strong> ensures that you are
                    connecting to the official website and that any information
                    you provide is encrypted and transmitted securely.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  },
);
