import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SearchBox } from './SearchBox';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';
import close from '../../../node_modules/uswds/dist/img/close.svg';
import seal from '../images/ustc_seal.svg';

import { AccountMenu, AccountMenuItems } from './AccountMenu';

const NavigationItems = (helper, { navigateToPathSequence }) => {
  return (
    <ul className="usa-nav__primary usa-unstyled-list">
      {helper.showHomeIcon && (
        <li
          className={classNames(
            'ustc-nav-no-active-underline',
            'usa-nav__primary-item',
            helper.pageIsHome && 'active',
          )}
        >
          <button
            onClick={() => {
              navigateToPathSequence({
                path: '/',
              });
            }}
          >
            <FontAwesomeIcon icon="home" />
            <span className="sr-only">Home</span>
          </button>
        </li>
      )}
      {helper.showMessages && (
        <li
          className={
            helper.pageIsMessages
              ? 'usa-nav__primary-item active'
              : 'usa-nav__primary-item'
          }
        >
          <button
            className="usa-button usa-button__unstyled"
            href="/messages/my/inbox"
            onClick={() => {
              navigateToPathSequence({
                path: '/messages/my/inbox',
              });
            }}
          >
            Messages{' '}
            {helper.showMessagesIcon && (
              <FontAwesomeIcon
                aria-hidden="false"
                aria-label="unread message"
                className="iconStatusUnread"
                icon={['fas', 'envelope']}
                size="sm"
              />
            )}
          </button>
        </li>
      )}
      {helper.showDocumentQC && (
        <li
          className={
            helper.pageIsDocumentQC
              ? 'usa-nav__primary-item active'
              : 'usa-nav__primary-item'
          }
        >
          <button
            className="usa-button usa-button__unstyled"
            title="Document QC"
            onClick={() => {
              navigateToPathSequence({
                path: helper.defaultQCBoxPath,
              });
            }}
          >
            Document QC
          </button>
        </li>
      )}
      {helper.showMyCases && (
        <li
          className={
            helper.pageIsMyCases
              ? 'usa-nav__primary-item active'
              : 'usa-nav__primary-item'
          }
        >
          <button
            className="usa-button usa-button__unstyled"
            onClick={() => {
              navigateToPathSequence({
                path: '/',
              });
            }}
          >
            My Cases
          </button>
        </li>
      )}
      {helper.showTrialSessions && (
        <li
          className={
            helper.pageIsTrialSessions
              ? 'usa-nav__primary-item active'
              : 'usa-nav__primary-item'
          }
        >
          <button
            className="usa-button usa-button__unstyled"
            onClick={() => {
              navigateToPathSequence({
                path: '/trial-sessions',
              });
            }}
          >
            Trial Sessions
          </button>
        </li>
      )}
    </ul>
  );
};

export const Header = connect(
  {
    betaBar: state.betaBar,
    helper: state.headerHelper,
    loginSequence: sequences.gotoLoginSequence,
    mobileMenu: state.mobileMenu,
    navigateToPathSequence: sequences.navigateToPathSequence,
    signOutSequence: sequences.signOutSequence,
    toggleBetaBarSequence: sequences.toggleBetaBarSequence,
    toggleMobileMenuSequence: sequences.toggleMobileMenuSequence,
    user: state.user,
  },
  ({
    betaBar,
    helper,
    loginSequence,
    mobileMenu,
    navigateToPathSequence,
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
                  for public use. To learn more about starting a case, visit the{' '}
                  <a href="https://www.ustaxcourt.gov/">
                    U.S. Tax Court website
                  </a>
                  .
                </div>
                <div className="grid-col-2">
                  <button
                    className="button-icon float-right usa-button usa-button--unstyled"
                    onClick={() => toggleBetaBarSequence()}
                  >
                    <img alt="close" src={close} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <header
          className="usa-header usa-header-extended grid-container"
          role="banner"
        >
          <div className="grid-col-1">
            <div className="usa-logo" id="extended-logo">
              <button
                onClick={() => {
                  navigateToPathSequence({
                    path: '/',
                  });
                }}
              >
                <img alt="USTC Seal" src={seal} />
              </button>
            </div>
          </div>
          <div className="grid-col-7">
            <nav className="main-navigation" role="navigation">
              {user &&
                NavigationItems(helper, {
                  navigateToPathSequence,
                })}
            </nav>
          </div>
          <div className="grid-col-4">
            <button
              className="usa-menu-btn"
              onClick={() => toggleMobileMenuSequence()}
            >
              Menu
            </button>
            <nav
              className={
                mobileMenu.isVisible
                  ? 'usa-nav mobile-menu is-visible'
                  : 'usa-nav'
              }
              role="navigation"
            >
              <div className="usa-nav-inner">
                <button
                  className="usa-nav-close"
                  onClick={() => toggleMobileMenuSequence()}
                >
                  Close{' '}
                  <FontAwesomeIcon
                    className="account-menu-icon"
                    icon={['fa', 'times-circle']}
                  />
                </button>
                <div className="header-search-container">
                  <ul className="usa-unstyled-list padding-left-0">
                    {helper.showSearchInHeader && (
                      <li className="usa-search" role="search">
                        <SearchBox />
                        {user && user.userId && (
                          <div className="mobile-account-menu-container">
                            {NavigationItems(helper, {
                              navigateToPathSequence,
                            })}
                          </div>
                        )}
                      </li>
                    )}
                    {user && user.userId && (
                      <li className="user-dropdown">
                        <AccountMenu />
                      </li>
                    )}
                  </ul>
                  <div className="account-menu-items">
                    {mobileMenu.isVisible && user && user.userId && (
                      <AccountMenuItems signOut={signOutSequence} />
                    )}
                  </div>
                </div>
                {!user && (
                  <div className="">
                    <ul className="usa-unstyled-list">
                      <li>
                        <button
                          aria-label="login"
                          className="button-account-login"
                          title="Login"
                          type="button"
                          onClick={() => loginSequence()}
                        >
                          <FontAwesomeIcon
                            className="account-menu-icon user-icon"
                            icon={['far', 'user']}
                          />{' '}
                          Log In
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </header>
      </>
    );
  },
);
