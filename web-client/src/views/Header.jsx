import { AccountMenu } from './AccountMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReportsMenu } from './ReportsMenu';
import { SearchBox } from './SearchBox';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import close from '../../../node_modules/uswds/dist/img/close.svg';
import seal from '../images/ustc_seal.svg';

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

const NavigationItems = (helper, { isReportsMenuOpen }) => {
  return (
    <ul className="usa-nav__primary usa-accordion ustc-navigation-items">
      {helper.showHomeIcon && (
        <li className="usa-nav__primary-item">
          <a
            className={classNames(
              'hidden-underline usa-nav__link',
              helper.pageIsHome && 'usa-current',
            )}
            href="/"
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
          >
            Trial Sessions
          </a>
        </li>
      )}
      {helper.showReports && (
        <li
          className={classNames(
            'usa-nav__primary-item',
            isReportsMenuOpen && 'usa-nav__submenu--open',
          )}
        >
          <ReportsMenu isExpanded={isReportsMenuOpen} />
        </li>
      )}
    </ul>
  );
};

export class HeaderComponent extends React.Component {
  constructor(props) {
    super(props);
    this.clearAlertSequence = props.clearAlertSequence;
    this.resetSequence = props.resetHeaderAccordionsSequence;
    this.headerRef = React.createRef();

    this.headerNavClick = this.headerNavClick.bind(this);
    this.keydown = this.keydown.bind(this);
    this.reset = this.reset.bind(this);
  }

  headerNavClick(e) {
    e.stopPropagation();
    this.resetSequence();
    this.clearAlertSequence();
    return true;
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.reset, false);
    document.addEventListener('keydown', this.keydown, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.reset, false);
    document.removeEventListener('keydown', this.keydown, false);
  }

  keydown(event) {
    if (event.keyCode === 27) {
      return this.reset(event);
    }
  }

  reset(e) {
    const clickedWithinThisComponent = this.headerRef.current.contains(
      e.target,
    );
    const clickedOnMenuButton = e.target.closest('.usa-accordion__button');
    const clickedOnSubnav = e.target.closest('.usa-nav__submenu-item');
    if (!clickedWithinThisComponent) {
      return this.resetSequence();
    } else if (!clickedOnMenuButton && !clickedOnSubnav) {
      return this.resetSequence();
    }
  }

  render() {
    const {
      betaBar,
      helper,
      isAccountMenuOpen,
      isReportsMenuOpen,
      mobileMenu,
      toggleBetaBarSequence,
      toggleMobileMenuSequence,
      user,
    } = this.props;
    return (
      <div ref={this.headerRef}>
        {betaBar.isVisible && BetaBar(toggleBetaBarSequence)}
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
                  mobileMenu.isVisible && 'is-visible',
                )}
                role="navigation"
              >
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
                    isReportsMenuOpen,
                  })}
                {helper.showSearchInHeader && <SearchBox />}
                {helper.showAccountMenu && (
                  <AccountMenu isExpanded={isAccountMenuOpen} />
                )}
              </nav>
            </div>
          </header>
        </div>
      </div>
    );
  }
}

HeaderComponent.propTypes = {
  betaBar: PropTypes.object,
  clearAlertSequence: PropTypes.func,
  helper: PropTypes.object,
  isAccountMenuOpen: PropTypes.bool,
  isReportsMenuOpen: PropTypes.bool,
  mobileMenu: PropTypes.object,
  resetHeaderAccordionsSequence: PropTypes.func,
  toggleBetaBarSequence: PropTypes.func,
  toggleMobileMenuSequence: PropTypes.func,
  user: PropTypes.object,
};

export const Header = connect(
  {
    betaBar: state.betaBar,
    clearAlertSequence: sequences.clearAlertSequence,
    helper: state.headerHelper,
    isAccountMenuOpen: state.menuHelper.isAccountMenuOpen,
    isReportsMenuOpen: state.menuHelper.isReportsMenuOpen,
    mobileMenu: state.mobileMenu,
    resetHeaderAccordionsSequence: sequences.resetHeaderAccordionsSequence,
    toggleBetaBarSequence: sequences.toggleBetaBarSequence,
    toggleMobileMenuSequence: sequences.toggleMobileMenuSequence,
    user: state.user,
  },
  HeaderComponent,
);
