/* eslint-disable react/jsx-no-target-blank */
import { Button } from '../ustc-ui/Button/Button';
import { DeployedDate } from './DeployedDate';
import { Icon } from '../ustc-ui/Icon/Icon';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';
import seal from '../images/ustc_seal.svg';

const ScrollToTopButton = () => {
  return (
    <Button
      link
      className="usa-footer__primary-link inline-block text-left margin-top-1"
      overrideMargin={true}
      onClick={e => {
        e.preventDefault();
        window.scrollTo(0, 0);
      }}
    >
      <Icon
        aria-label="return to top"
        className="margin-right-1"
        icon={['fas', 'long-arrow-alt-up']}
        size="1x"
      />{' '}
      Return to top
    </Button>
  );
};

export const Footer = connect(
  {
    loadingHelper: state.loadingHelper,
  },
  function Footer({ loadingHelper }) {
    return (
      <>
        {!loadingHelper.pageIsInterstitial && (
          <>
            <footer className="usa-footer usa-footer--slim" id="app-footer">
              <DeployedDate />
              <div className="usa-footer__primary-section">
                <div className="usa-footer__primary-container grid-row">
                  <div className="grid-col-9" id="footer-links">
                    <nav
                      aria-label="Footer navigation"
                      className="usa-footer__nav"
                    >
                      <ul className="grid-row grid-gap">
                        <li className="usa-footer__primary-content show-on-mobile">
                          <ScrollToTopButton />
                        </li>
                        <li className="usa-footer__primary-content">
                          <a
                            className="usa-footer__primary-link usa-link--external"
                            href="https://www.ustaxcourt.gov/release_notes.html"
                            target="_blank"
                          >
                            What’s New in DAWSON
                          </a>
                        </li>
                        <li className="usa-footer__primary-content">
                          <a
                            className="usa-footer__primary-link usa-link--external"
                            href="https://ustaxcourt.gov/dawson.html"
                            target="_blank"
                          >
                            Frequently Asked Questions
                          </a>
                        </li>
                        <li className="usa-footer__primary-content">
                          <a
                            className="usa-footer__primary-link"
                            href="/privacy"
                          >
                            Privacy
                          </a>
                        </li>
                        <li className="usa-footer__primary-content">
                          <a
                            className="usa-footer__primary-link"
                            href="/contact"
                          >
                            Contact Us
                          </a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                  <div className="grid-col-3 hide-on-mobile text-right">
                    <ScrollToTopButton />
                  </div>
                </div>
              </div>
              <div className="usa-footer__secondary-section">
                <div className="grid-container">
                  <div className="grid-row">
                    <div className="grid-col-4 footer-left">
                      <div className="grid-row grid-gap-1 usa-footer__logo">
                        <div>
                          <div className="usa-logo">
                            <a href="/">
                              <img alt="USTC Seal" src={seal} />
                            </a>
                          </div>
                        </div>

                        <div className="grid-col-9">
                          <div className="usa-footer__logo-heading heading-3">
                            United States Tax Court
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid-col-8 footer-right">
                      This is a U.S. government system. Your use indicates your
                      consent to monitoring and recording. Therefore, no
                      expectation of privacy is to be assumed. Misuse is subject
                      to criminal and civil penalties.
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          </>
        )}
      </>
    );
  },
);
