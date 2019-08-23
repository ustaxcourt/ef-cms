import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const AccountMenu = connect(
  {
    closeAccountMenu: sequences.closeAccountMenuSequence,
    signOutSequence: sequences.signOutSequence,
    toggleAccountMenu: sequences.toggleAccountMenuSequence,
    user: state.user,
  },
  ({ isExpanded, signOutSequence, toggleAccountMenu, user }) => {
    return (
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
            onClick={() => toggleAccountMenu()}
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
    );
  },
);
