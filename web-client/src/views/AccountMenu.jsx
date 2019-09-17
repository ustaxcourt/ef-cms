import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Mobile, NonMobile } from '../ustc-ui/Responsive/Responsive';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const AccountMenu = connect(
  {
    signOutSequence: sequences.signOutSequence,
    toggleMenuSequence: sequences.toggleMenuSequence,
    user: state.user,
  },
  ({ isExpanded, signOutSequence, toggleMenuSequence, user }) => {
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
                title={`Hello, ${user.name}`}
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
                    <button
                      className="account-menu-item usa-button usa-button--unstyled"
                      id="log-out"
                      onClick={() => signOutSequence()}
                    >
                      Log Out
                    </button>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </NonMobile>
        <Mobile>
          <ul className="usa-nav__primary usa-accordion ustc-navigation-items">
            <li className="usa-nav__primary-item">
              <button
                className="account-menu-item usa-button usa-button--unstyled"
                id="log-out"
                onClick={() => signOutSequence()}
              >
                Log Out
              </button>
            </li>
          </ul>
        </Mobile>
      </>
    );
  },
);
