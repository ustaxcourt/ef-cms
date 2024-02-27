import { AccountMenu } from './AccountMenu';
import { Button } from '../../ustc-ui/Button/Button';
import { DocumentQCMenu } from './DocumentQCMenu';
import { MessagesMenu } from './MessagesMenu';
import { ReportsMenu } from './ReportsMenu';
import { SearchBox } from './SearchBox';
import { VerifyEmailWarningNotification } from '../VerifyEmailWarningNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import closeImg from '../../../../node_modules/@uswds/uswds/dist/img/usa-icons/close.svg';
const seal = require('../../images/ustc_seal.svg') as string;

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
              className="button-icon float-right"
              onClick={() => toggleBetaBarSequence()}
            >
              <img alt="close" src={closeImg} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// eslint-disable-next-line complexity
const NavigationItems = (
  headerHelper,
  {
    isDocumentQCMenuOpen,
    isMessagesMenuOpen,
    isReportsMenuOpen,
    signOutSequence,
    toggleMobileMenuSequence,
  },
) => {
  return (
    <ul className="usa-nav__primary usa-accordion ustc-navigation-items">
      {headerHelper.showHomeIcon && (
        <li className="usa-nav__primary-item">
          <a
            className={classNames(
              'usa-nav__link',
              headerHelper.pageIsHome && 'usa-current',
            )}
            href="/"
            onClick={() => toggleMobileMenuSequence()}
          >
            Dashboard
          </a>
        </li>
      )}
      {headerHelper.showMessages && (
        <li className={classNames('usa-nav__primary-item')}>
          {headerHelper.unreadMessageCount > 0 && (
            <div
              className="icon-unread-messages display-inline-block padding-top-2px text-bold text-ttop margin-left-2 margin-bottom-05 margin-right-neg-105 text-center"
              data-testid="header-message-count"
            >
              {headerHelper.unreadMessageCount}
            </div>
          )}
          <a
            className={classNames(
              'usa-nav__link',
              headerHelper.pageIsMessages && 'usa-current',
              'display-inline-block',
            )}
            data-testid="header-messages-link"
            href="/messages/my/inbox"
            onClick={() => toggleMobileMenuSequence()}
          >
            Messages
          </a>
        </li>
      )}
      {headerHelper.showMessagesAndQCDropDown && (
        <>
          <li
            className={classNames('usa-nav__primary-item', 'unread-messages')}
          >
            {headerHelper.unreadMessageCount > 0 && !isMessagesMenuOpen && (
              <div className="icon-unread-messages display-inline-block padding-top-2px text-bold text-ttop margin-left-2 margin-bottom-05 margin-right-neg-105 text-center">
                {headerHelper.unreadMessageCount}
              </div>
            )}
          </li>
          <li
            className={classNames(
              'usa-nav__primary-item',
              isMessagesMenuOpen && 'usa-nav__submenu--open',
            )}
          >
            <MessagesMenu isExpanded={isMessagesMenuOpen} />
          </li>
          <li
            className={classNames(
              'usa-nav__primary-item',
              isDocumentQCMenuOpen && 'usa-nav__submenu--open',
            )}
          >
            <DocumentQCMenu isExpanded={isDocumentQCMenuOpen} />
          </li>
        </>
      )}
      {headerHelper.showDocumentQC && (
        <li className={classNames('usa-nav__primary-item')}>
          <a
            className={classNames(
              'usa-nav__link',
              headerHelper.pageIsDocumentQC && 'usa-current',
            )}
            data-testid="document-qc-nav-item"
            href={headerHelper.defaultQCBoxPath}
            onClick={() => toggleMobileMenuSequence()}
          >
            Document QC
          </a>
        </li>
      )}
      {headerHelper.showMyCases && (
        <li className={classNames('usa-nav__primary-item')}>
          <a
            className={classNames(
              'usa-nav__link',
              headerHelper.pageIsMyCases && 'usa-current',
            )}
            data-testid="my-cases-link"
            href="/"
            onClick={() => toggleMobileMenuSequence()}
          >
            My Cases
          </a>
        </li>
      )}
      {headerHelper.showSearchNavItem && (
        <li className={classNames('usa-nav__primary-item')}>
          <a
            className={classNames(
              'usa-nav__link',
              headerHelper.pageIsDashboard && 'usa-current',
            )}
            href="/"
            onClick={() => toggleMobileMenuSequence()}
          >
            Search
          </a>
        </li>
      )}
      {headerHelper.showTrialSessions && (
        <li className={classNames('usa-nav__primary-item')}>
          <a
            className={classNames(
              'usa-nav__link',
              headerHelper.pageIsTrialSessions && 'usa-current',
            )}
            data-testid="trial-session-link"
            href="/trial-sessions"
            onClick={() => toggleMobileMenuSequence()}
          >
            Trial Sessions
          </a>
        </li>
      )}
      {headerHelper.showReports && (
        <li
          className={classNames(
            'usa-nav__primary-item',
            isReportsMenuOpen && 'usa-nav__submenu--open',
          )}
        >
          <ReportsMenu isExpanded={isReportsMenuOpen} />
        </li>
      )}
      {headerHelper.showMyAccount && (
        <li className="usa-nav__primary-item nav-medium">
          <a
            className="usa-nav__link"
            href="/my-account"
            id="my-account"
            onClick={() => toggleMobileMenuSequence()}
          >
            My Account
          </a>
        </li>
      )}
      <li className="usa-nav__primary-item nav-medium">
        <button
          className="usa-nav__link"
          data-testid="logout-button-mobile"
          id="log-out"
          onClick={() => {
            toggleMobileMenuSequence();
            signOutSequence();
          }}
        >
          Log Out
        </button>
      </li>
    </ul>
  );
};

export const Header = connect(
  {
    headerHelper: state.headerHelper,
    menuHelper: state.menuHelper,
    resetHeaderAccordionsSequence: sequences.resetHeaderAccordionsSequence,
    showMobileMenu: state.header.showMobileMenu,
    signOutSequence: sequences.signOutSequence,
    templateHelper: state.templateHelper,
    toggleBetaBarSequence: sequences.toggleBetaBarSequence,
    toggleMobileMenuSequence: sequences.toggleMobileMenuSequence,
    user: state.user,
  },
  function Header({
    headerHelper,
    menuHelper,
    resetHeaderAccordionsSequence,
    showMobileMenu,
    signOutSequence,
    templateHelper,
    toggleBetaBarSequence,
    toggleMobileMenuSequence,
    user,
  }) {
    const headerRef = useRef(null);

    useEffect(() => {
      window.document.addEventListener('mousedown', reset, false);
      window.document.addEventListener('keydown', keydown, false);
      return () => {
        window.document.removeEventListener('mousedown', reset, false);
        window.document.removeEventListener('keydown', keydown, false);
      };
    }, []);

    const keydown = event => {
      if (event.keyCode === 27) {
        return resetHeaderAccordionsSequence();
      }
    };

    const reset = e => {
      const clickedWithinComponent = headerRef.current.contains(e.target);
      const clickedOnMenuButton = e.target.closest('.usa-accordion__button');
      const clickedOnSubNav = e.target.closest('.usa-nav__submenu-item');
      if (!clickedWithinComponent) {
        return resetHeaderAccordionsSequence();
      } else if (!clickedOnMenuButton && !clickedOnSubNav) {
        return resetHeaderAccordionsSequence();
      }
    };

    return (
      <>
        <div ref={headerRef}>
          {templateHelper.showBetaBar && BetaBar(toggleBetaBarSequence)}
          <div className="grid-container no-mobile-padding">
            <header
              className="usa-header usa-header--basic ustc-header"
              role="banner"
            >
              <div className="usa-nav-container">
                <div className="usa-navbar">
                  <div className="usa-logo">
                    <a href={headerHelper.ustcSealLink}>
                      <img alt="USTC Seal" src={seal} />
                    </a>
                  </div>
                  {!headerHelper.isLoggedIn && (
                    <h1 className="header-welcome-public">Welcome to DAWSON</h1>
                  )}
                  {headerHelper.showMobileAccountMenu && (
                    <button
                      className="usa-menu-btn"
                      data-testid="account-menu-button-mobile"
                      onClick={() => toggleMobileMenuSequence()}
                    >
                      Menu
                    </button>
                  )}
                </div>
                <nav
                  className={classNames(
                    'usa-nav ustc-nav',
                    showMobileMenu && 'is-visible',
                  )}
                  role="navigation"
                >
                  <Button
                    iconRight
                    link
                    className="usa-nav__close float-right margin-right-0 padding-top-0"
                    icon="times-circle"
                    onClick={() => toggleMobileMenuSequence()}
                  >
                    Close
                  </Button>
                  {user &&
                    NavigationItems(headerHelper, {
                      isDocumentQCMenuOpen: menuHelper.isDocumentQCMenuOpen,
                      isMessagesMenuOpen: menuHelper.isMessagesMenuOpen,
                      isReportsMenuOpen: menuHelper.isReportsMenuOpen,
                      signOutSequence,
                      toggleMobileMenuSequence,
                    })}
                  {headerHelper.showSearchInHeader && <SearchBox />}
                  {headerHelper.showAccountMenu && (
                    <AccountMenu isExpanded={menuHelper.isAccountMenuOpen} />
                  )}
                </nav>
              </div>
            </header>
          </div>
        </div>

        {headerHelper.showVerifyEmailWarningNotification && (
          <VerifyEmailWarningNotification />
        )}
      </>
    );
  },
);

Header.displayName = 'Header';
