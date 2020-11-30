import { DeployedDate } from './DeployedDate';
import { Icon } from '../ustc-ui/Icon/Icon';
import React from 'react';
import seal from '../images/ustc_seal.svg';

export const Footer = () => (
  <footer className="usa-footer usa-footer--slim" id="app-footer">
    <DeployedDate />
    <div className="usa-footer__primary-section">
      <div className="usa-footer__primary-container grid-row">
        <div className="grid-col-9" id="footer-links">
          <nav aria-label="Footer navigation" className="usa-footer__nav">
            <ul className="grid-row grid-gap" id="footer-links">
              <li className="usa-footer__primary-content show-on-mobile">
                <a
                  className="usa-footer__primary-link"
                  href="#top"
                  // eslint-disable-next-line react/jsx-no-target-blank
                  target="_blank"
                >
                  <Icon
                    aria-label="retun to top"
                    className="margin-right-1"
                    icon={['fas', 'long-arrow-alt-up']}
                    size="1x"
                  />{' '}
                  Return to top
                </a>
              </li>
              <li className="usa-footer__primary-content">
                <a
                  className="usa-footer__primary-link usa-link--external"
                  href="https://ustaxcourt.gov/dawson.html"
                  // eslint-disable-next-line react/jsx-no-target-blank
                  target="_blank"
                >
                  Frequently Asked Questions
                </a>
              </li>
              <li className="usa-footer__primary-content">
                <a className="usa-footer__primary-link" href="/privacy">
                  Privacy
                </a>
              </li>
              <li className="usa-footer__primary-content">
                <a className="usa-footer__primary-link" href="/contact">
                  Contact Us
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="grid-col-3 hide-on-mobile text-right">
          <a className="usa-footer__primary-link" href="#top">
            <Icon
              aria-label="retun to top"
              className="margin-right-1"
              icon={['fas', 'long-arrow-alt-up']}
              size="1x"
            />
            Return to top
          </a>
        </div>
      </div>
    </div>
    <div className="usa-footer__secondary-section">
      <div className="grid-container">
        <div className="grid-row">
          <div className="grid-col-4 footer-left">
            <div className="grid-row grid-gap-1 usa-footer__logo">
              <div className="">
                <div className="usa-logo">
                  <a href="/">
                    <img alt="USTC Seal" src={seal} />
                  </a>
                </div>
              </div>

              <div className="grid-col-9">
                <h3 className="usa-footer__logo-heading">
                  United States Tax Court
                </h3>
              </div>
            </div>
          </div>
          <div className="grid-col-8 footer-right">
            This is a U.S. government system. Your use indicates your consent to
            monitoring and recording. Therefore, no expectation of privacy is to
            be assumed. Misuse is subject to criminal and civil penalties.
          </div>
        </div>
      </div>
    </div>
  </footer>
);
