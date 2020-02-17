import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const AccountMenu = connect(
  {
    headerHelper: state.headerHelper,
    signOutSequence: sequences.signOutSequence,
    toggleMenuSequence: sequences.toggleMenuSequence,
  },
  ({ headerHelper, isExpanded, signOutSequence, toggleMenuSequence }) => {
    const LogOutButton = () => (
      <button
        className="account-menu-item usa-button usa-button--unstyled"
        id="log-out"
        onClick={() => signOutSequence()}
      >
        Log Out
      </button>
    );

    return (
      <>
        <NonMobile>
          <ul className="usa-nav__primary usa-accordion">
            <li
              className={classNames(
                'usa-nav__primary-item',
                isExpanded && 'usa-nav__submenu--open',
              )}
            >
              <button
                aria-expanded={isExpanded}
                className={classNames(
                  'usa-accordion__button usa-nav__link hidden-underline',
                )}
                title={`Hello, ${headerHelper.userName}`}
                onClick={() => {
                  toggleMenuSequence({ openMenu: 'AccountMenu' });
                }}
              >
                <span>
                  <FontAwesomeIcon
                    className="account-menu-icon"
                    icon={['far', 'user']}
                  />
                </span>
              </button>
              {isExpanded && (
                <ul className="usa-nav__submenu position-right-0">
                  <li className="usa-nav__submenu-item">
                    <LogOutButton />
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </NonMobile>
        <Mobile>
          <ul className="usa-nav__primary usa-accordion ustc-navigation-items">
            <li className="usa-nav__primary-item">
              <LogOutButton />
            </li>
          </ul>
        </Mobile>
      </>
    );
  },
);
