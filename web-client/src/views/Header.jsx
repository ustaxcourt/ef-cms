import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SearchBox } from './SearchBox';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';
import close from '../../../node_modules/uswds/dist/img/close.svg';
import seal from '../images/ustc_seal.svg';

import { AccountMenu } from './AccountMenu';
import { ReportsMenu } from './ReportsMenu';

const BetaBar = toggleBetaBarSequence => {
  return (
    <div className="beta">
      <div className="grid-container">
        <div className="grid-row">
          <div className="grid-col-10">
            This is a testing site for the U.S. Tax Court and not intended for
            public use. To learn more about starting a case, visit the{' '}
            <a href="https://www.ustaxcourt.gov/">U.S. Tax Court website</a>.
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
  );
};

const NavigationItems = (helper, { clearAlertSequence, isReportsMenuOpen }) => {
  return (
    <ul className="usa-nav__primary usa-accordion">
      {helper.showHomeIcon && (
        <li
          className={classNames(
            'ustc-nav-no-active-underline',
            'usa-nav__primary-item',
          )}
        >
          <a
            className={classNames(
              'usa-nav__link',
              helper.pageIsHome && 'usa-current',
            )}
            href="/"
            onClick={() => {
              clearAlertSequence();
            }}
          >
            <FontAwesomeIcon icon="home" />
            <span className="sr-only">Home</span>
          </a>
        </li>
      )}
      {helper.showMessages && (
        <li className={classNames('usa-nav__primary-item')}>
          <a
            className={classNames(
              'usa-nav__link',
              helper.pageIsMessages && 'usa-current',
            )}
            href="/messages/my/inbox"
            onClick={() => {
              clearAlertSequence();
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
          </a>
        </li>
      )}
      {helper.showDocumentQC && (
        <li className={classNames('usa-nav__primary-item')}>
          <a
            className={classNames(
              'usa-nav__link',
              helper.pageIsDocumentQC && 'usa-current',
            )}
            href={helper.defaultQCBoxPath}
            onClick={() => {
              clearAlertSequence();
            }}
          >
            Document QC
          </a>
        </li>
      )}
      {helper.showMyCases && (
        <li className={classNames('usa-nav__primary-item')}>
          <a
            className={classNames(
              'usa-nav__link',
              helper.pageIsMyCases && 'usa-current',
            )}
            href="/"
            onClick={() => {
              clearAlertSequence();
            }}
          >
            My Cases
          </a>
        </li>
      )}
      {helper.showTrialSessions && (
        <li className={classNames('usa-nav__primary-item')}>
          <a
            className={classNames(
              'usa-nav__link',
              helper.pageIsTrialSessions && 'usa-current',
            )}
            href="/trial-sessions"
            onClick={() => {
              clearAlertSequence();
            }}
          >
            Trial Sessions
          </a>
        </li>
      )}
      {helper.showReports && (
        <li
          className={classNames(
            'usa-nav__primary-item',
            helper.pageIsReports && 'usa-current',
            isReportsMenuOpen && 'usa-nav__submenu--open',
          )}
        >
          <ReportsMenu isExpanded={isReportsMenuOpen} />
        </li>
      )}
    </ul>
  );
};

export const Header = connect(
  {
    betaBar: state.betaBar,
    clearAlertSequence: sequences.clearAlertSequence,
    helper: state.headerHelper,
    isReportsMenuOpen: state.menuHelper.isReportsMenuOpen,
    toggleBetaBarSequence: sequences.toggleBetaBarSequence,
    toggleMobileMenuSequence: sequences.toggleMobileMenuSequence,
    user: state.user,
  },
  ({
    betaBar,
    clearAlertSequence,
    helper,
    isReportsMenuOpen,
    toggleBetaBarSequence,
    toggleMobileMenuSequence,
    user,
  }) => {
    return (
      <>
        {betaBar.isVisible && BetaBar(toggleBetaBarSequence)}
        <div className="grid-container">
          <header
            className="usa-header usa-header--basic ustc-header"
            role="banner"
          >
            <div className="usa-nav-container">
              <div className="usa-navbar">
                <div className="usa-logo">
                  <a
                    href="/"
                    onClick={() => {
                      clearAlertSequence();
                    }}
                  >
                    <img alt="USTC Seal" src={seal} />
                  </a>
                </div>
                <button
                  className="usa-menu-btn"
                  onClick={() => toggleMobileMenuSequence()}
                >
                  Menu
                </button>
              </div>
              <nav className="usa-nav ustc-nav" role="navigation">
                <button
                  className="usa-nav__close"
                  onClick={() => toggleMobileMenuSequence()}
                >
                  Close{' '}
                  <FontAwesomeIcon
                    className="account-menu-icon"
                    icon={['fa', 'times-circle']}
                  />
                </button>
                {user &&
                  NavigationItems(helper, {
                    clearAlertSequence,
                    isReportsMenuOpen,
                  })}
                {helper.showSearchInHeader && <SearchBox />}
                {helper.showAccountMenu && <AccountMenu />}
              </nav>
            </div>
          </header>
        </div>
      </>
    );
  },
);
