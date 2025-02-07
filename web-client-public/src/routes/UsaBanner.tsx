import React, { useState } from 'react';
import usFlag from '../../../node_modules/@uswds/uswds/dist/img/us_flag_small.png';

export function UsaBanner() {
  const [showUsaBannerDetails, setShowUsaBannerDetails] = useState(false);

  return (
    <section className="site-banner usa-banner">
      <div className="usa-accordion">
        <header className="usa-banner__header">
          <div className="grid-container usa-banner__inner">
            <div className="grid-col-auto">
              {' '}
              <img
                alt="U.S. flag"
                className="usa-banner__header-flag"
                src={usFlag}
              />
            </div>
            <div className="grid-col-fill tablet:grid-col-auto">
              <p className="usa-banner__header-text">
                An official website of the United States government
              </p>
              <p aria-hidden="true" className="usa-banner__header-action">
                Here’s how you know
              </p>
            </div>
            <button
              aria-controls="gov-banner"
              aria-expanded={showUsaBannerDetails}
              className="usa-accordion__button usa-banner__button"
              onClick={() => setShowUsaBannerDetails(!showUsaBannerDetails)}
            >
              <span className="usa-banner__button-text">
                Here’s how you know
              </span>
            </button>
          </div>
        </header>
        {showUsaBannerDetails && (
          <div
            aria-hidden="false"
            className="usa-banner__content grid-container usa-accordion__content"
            id="gov-banner"
          >
            <div className="grid-row grid-gap-lg">
              <div className="usa-banner__guidance tablet:grid-col-6">
                <DotGovIcon className="usa-banner__icon usa-media-block__img" />
                <div className="usa-media-block__body">
                  <p>
                    <strong>The .gov means it’s official.</strong>
                    <br />
                    Federal government websites often end in .gov or .mil.
                    Before sharing sensitive information, make sure you’re on a
                    federal government site.
                  </p>
                </div>
              </div>
              <div className="usa-banner__guidance tablet:grid-col-6">
                <HttpsIcon className="usa-banner__icon usa-media-block__img" />
                <div className="usa-media-block__body">
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
          </div>
        )}
      </div>
    </section>
  );
}

function DotGovIcon({ ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      viewBox="0 0 64 64"
    >
      <title>icon-dot-gov</title>
      <path
        fill="#2378C3"
        fillRule="evenodd"
        d="m32 0c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zm0 1.2c-17 0-30.8 13.8-30.8 30.8s13.8 30.8 30.8 30.8 30.8-13.8 30.8-30.8-13.8-30.8-30.8-30.8zm11.4 38.9c.5 0 .9.4.9.8v1.6h-24.6v-1.6c0-.5.4-.8.9-.8zm-17.1-12.3v9.8h1.6v-9.8h3.3v9.8h1.6v-9.8h3.3v9.8h1.6v-9.8h3.3v9.8h.8c.5 0 .9.4.9.8v.8h-21.4v-.8c0-.5.4-.8.9-.8h.8v-9.8zm5.7-8.2 12.3 4.9v1.6h-1.6c0 .5-.4.8-.9.8h-19.6c-.5 0-.9-.4-.9-.8h-1.6v-1.6s12.3-4.9 12.3-4.9z"
      />
    </svg>
  );
}

function HttpsIcon({ ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      viewBox="0 0 64 64"
    >
      <title>icon-https</title>
      <path
        fill="#719F2A"
        fillRule="evenodd"
        d="M32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0zm0 1.208C14.994 1.208 1.208 14.994 1.208 32S14.994 62.792 32 62.792 62.792 49.006 62.792 32 49.006 1.208 32 1.208zm0 18.886a7.245 7.245 0 0 1 7.245 7.245v3.103h.52c.86 0 1.557.698 1.557 1.558v9.322c0 .86-.697 1.558-1.557 1.558h-15.53c-.86 0-1.557-.697-1.557-1.558V32c0-.86.697-1.558 1.557-1.558h.52V27.34A7.245 7.245 0 0 1 32 20.094zm0 3.103a4.142 4.142 0 0 0-4.142 4.142v3.103h8.284V27.34A4.142 4.142 0 0 0 32 23.197z"
      />
    </svg>
  );
}

UsaBanner.displayName = 'UsaBanner';
