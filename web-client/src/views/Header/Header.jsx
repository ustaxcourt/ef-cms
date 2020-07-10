import { AccountMenu } from './AccountMenu';
import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReportsMenu } from './ReportsMenu';
import { SearchBox } from './SearchBox';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import close from '../../../../node_modules/uswds/dist/img/close.svg';
import seal from '../../images/ustc_seal.svg';

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
              <img
                alt="close"
                className="ustc-icon-square--small"
                src={close}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NavigationItems = (
  headerHelper,
  { isReportsMenuOpen, signOutSequence, toggleMobileMenuSequence },
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
          <a
            className={classNames(
              'usa-nav__link',
              headerHelper.pageIsCaseMessages && 'usa-current',
            )}
            href="/case-messages/my/inbox"
            onClick={() => toggleMobileMenuSequence()}
          >
            Case Messages{' '}
            {headerHelper.showMessagesIcon && (
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
      {headerHelper.showMessages && (
        <li className={classNames('usa-nav__primary-item')}>
          <a
            className={classNames(
              'usa-nav__link',
              headerHelper.pageIsMessages && 'usa-current',
            )}
            href="/messages/my/inbox"
            onClick={() => toggleMobileMenuSequence()}
          >
            Messages{' '}
            {headerHelper.showMessagesIcon && (
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
      {headerHelper.showDocumentQC && (
        <li className={classNames('usa-nav__primary-item')}>
          <a
            className={classNames(
              'usa-nav__link',
              headerHelper.pageIsDocumentQC && 'usa-current',
            )}
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
      <li className="usa-nav__primary-item nav-medium">
        <a
          className="usa-nav__link"
          href="/"
          id="log-out"
          onClick={() => signOutSequence()}
        >
          Log Out
        </a>
      </li>
    </ul>
  );
};

export const Header = connect(
  {
    headerHelper: state.headerHelper,
    isAccountMenuOpen: state.menuHelper.isAccountMenuOpen,
    isReportsMenuOpen: state.menuHelper.isReportsMenuOpen,
    resetHeaderAccordionsSequence: sequences.resetHeaderAccordionsSequence,
    showBetaBar: state.header.showBetaBar,
    showMobileMenu: state.header.showMobileMenu,
    signOutSequence: sequences.signOutSequence,
    toggleBetaBarSequence: sequences.toggleBetaBarSequence,
    toggleMobileMenuSequence: sequences.toggleMobileMenuSequence,
    user: state.user,
  },
  function Header({
    headerHelper,
    isAccountMenuOpen,
    isReportsMenuOpen,
    resetHeaderAccordionsSequence,
    showBetaBar,
    showMobileMenu,
    signOutSequence,
    toggleBetaBarSequence,
    toggleMobileMenuSequence,
    user,
  }) {
    const headerRef = useRef(null);

    useEffect(() => {
      document.addEventListener('mousedown', reset, false);
      document.addEventListener('keydown', keydown, false);
      return () => {
        document.removeEventListener('mousedown', reset, false);
        document.removeEventListener('keydown', keydown, false);
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
      <div ref={headerRef}>
        {showBetaBar && BetaBar(toggleBetaBarSequence)}
        <div className="grid-container no-mobile-padding">
          <header
            className="usa-header usa-header--basic ustc-header"
            role="banner"
          >
            <div className="usa-nav-container">
              <div className="usa-navbar">
                <div className="usa-logo">
                  <a href="/">
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
                    isReportsMenuOpen,
                    signOutSequence,
                    toggleMobileMenuSequence,
                  })}
                {headerHelper.showSearchInHeader && <SearchBox />}
                {headerHelper.showAccountMenu && (
                  <AccountMenu isExpanded={isAccountMenuOpen} />
                )}
              </nav>
            </div>
          </header>
        </div>
      </div>
    );
  },
);
