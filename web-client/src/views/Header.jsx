import { SearchBox } from './SearchBox';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import close from '../../node_modules/uswds/dist/img/close.svg';
import seal from '../images/ustc_seal.svg';

import { AccountMenu } from './AccountMenu';

const getNavigationList = helper => {
  return (
    <ul className="usa-nav__primary usa-unstyled-list">
      {helper.showMessages && (
        <li className="usa-nav__primary-item">
          <a href="/">Messages</a>
        </li>
      )}
      {helper.showDocumentQC && (
        <li className="usa-nav__primary-item">
          <a href="/">Document QC</a>
        </li>
      )}
      {helper.showMyCases && (
        <li className="usa-nav__primary-item">
          <a href="/">My Cases</a>
        </li>
      )}
    </ul>
  );
};

export const Header = connect(
  {
    betaBar: state.betaBar,
    helper: state.headerHelper,
    mobileMenu: state.mobileMenu,
    toggleBetaBarSequence: sequences.toggleBetaBarSequence,
    toggleMobileMenuSequence: sequences.toggleMobileMenuSequence,
    user: state.user,
  },
  ({
    betaBar,
    helper,
    mobileMenu,
    toggleBetaBarSequence,
    toggleMobileMenuSequence,
    user,
  }) => {
    return (
      <>
        {betaBar.isVisible && (
          <div className="beta">
            <div className="usa-grid">
              <div className="usa-width-five-sixths">
                This is a testing site for the U.S. Tax Court and not intended
                public use. To learn more about starting a case, visit the{' '}
                <a href="https://www.ustaxcourt.gov/">U.S. Tax Court website</a>
                .
              </div>
              <div className="usa-width-one-sixth">
                <button
                  className="usa-button usa-button-outline usa-button-unstyled"
                  onClick={() => toggleBetaBarSequence()}
                >
                  <img src={close} alt="close" />
                </button>
              </div>
            </div>
          </div>
        )}
        <header className="usa-header usa-header-extended" role="banner">
          <div className="usa-navbar">
            <div className="usa-logo" id="extended-logo">
              <a href="/">
                <img src={seal} width="75" height="75" alt="USTC Seal" />
              </a>
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
              <div className="usa-nav-primary">{getNavigationList(helper)}</div>
              {user && (
                <div className="usa-nav-secondary">
                  <ul className="usa-unstyled-list usa-nav-secondary-links">
                    {helper.showSearchInHeader && (
                      <li role="search" className="usa-search">
                        <SearchBox />
                      </li>
                    )}
                    {user.userId && (
                      <li className="user-dropdown">
                        <AccountMenu />
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </nav>
        </header>
      </>
    );
  },
);
