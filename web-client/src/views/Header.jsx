import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SearchBox } from './SearchBox';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import close from '../../node_modules/uswds/dist/img/close.svg';

export const Header = connect(
  {
    betaBar: state.betaBar,
    helper: state.headerHelper,
    mobileMenu: state.mobileMenu,
    signOutSequence: sequences.signOutSequence,
    toggleBetaBarSequence: sequences.toggleBetaBarSequence,
    toggleMobileMenuSequence: sequences.toggleMobileMenuSequence,
    user: state.user,
  },
  ({
    betaBar,
    helper,
    mobileMenu,
    signOutSequence,
    toggleBetaBarSequence,
    toggleMobileMenuSequence,
    user,
  }) => {
    return (
      <>
        {betaBar.isVisible && (
          <div className="beta">
            <div className="grid-container">
              <div className="grid-row">
                <div className="grid-col-10">
                  This is a testing site for the U.S. Tax Court and not intended
                  public use. To learn more about starting a case, visit the{' '}
                  <a href="https://www.ustaxcourt.gov/">
                    U.S. Tax Court website
                  </a>
                  .
                </div>
                <div className="grid-col-2">
                  <button
                    className="usa-button usa-button__outline usa-button__unstyled"
                    onClick={() => toggleBetaBarSequence()}
                  >
                    <img src={close} alt="close" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/*
        <header className="usa-header usa-header-extended" role="banner">
          <div className="usa-navbar">
            <div className="usa-logo" id="extended-logo">
              <em className="usa-logo__text">
                <a href="/">United States Tax Court</a>
              </em>
            </div>
            <button
              className="usa-menu-btn"
              onClick={() => toggleMobileMenuSequence()}
            >
              Menu
            </button>
          </div>

          <nav
            role="navigation"
            className={mobileMenu.isVisible ? 'usa-nav is-visible' : 'usa-nav'}
          >
            <div className="usa-nav-inner">
              <button
                className="usa-nav-close"
                onClick={() => toggleMobileMenuSequence()}
              >
                <img src={close} alt="close" />
              </button>
              {user && (
                <div className="usa-nav-secondary">
                  <ul className="usa-unstyled-list usa-nav-secondary-links">
                    {helper.showSearchInHeader && (
                      <li role="search" className="usa-search">
                        <SearchBox />
                      </li>
                    )}
                    {user.userId && (
                      <li>
                        Hello, {user.name}
                        <button
                          type="button"
                          className="usa-button--outline sign-out"
                          aria-label="logout"
                          onClick={() => signOutSequence()}
                        >
                          <FontAwesomeIcon icon="sign-out-alt" />
                        </button>{' '}
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </nav>
        </header>
        */}
      </>
    );
  },
);
