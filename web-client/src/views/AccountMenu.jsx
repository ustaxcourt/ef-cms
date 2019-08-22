import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const AccountMenu = connect(
  {
    closeAccountMenu: sequences.closeAccountMenuSequence,
    isAccountMenuOpen: state.menuHelper.isAccountMenuOpen,
    signOutSequence: sequences.signOutSequence,
    toggleAccountMenu: sequences.toggleAccountMenuSequence,
    user: state.user,
  },
  ({ isAccountMenuOpen, signOutSequence, toggleAccountMenu, user }) => {
    return (
      <ul>
        <li className="usa-nav__primary-item">
          <button
            aria-expanded={isAccountMenuOpen}
            className="usa-accordion__button usa-nav__link"
            title={`Hello, ${user.name}`}
            onClick={() => toggleAccountMenu()}
          >
            <span>
              <FontAwesomeIcon
                className="account-menu-icon user-icon"
                icon={['far', 'user']}
              />
              <FontAwesomeIcon
                className="account-menu-icon caret"
                icon={['fa', 'caret-down']}
              />
            </span>
          </button>
          <ul className="usa-nav__submenu">
            <li className="usa-nav__submenu-item">
              <button
                className="account-menu-item usa-button--unstyled"
                id="log-out"
                onClick={() => signOutSequence()}
              >
                Log Out
              </button>
            </li>
          </ul>
        </li>
      </ul>
    );
  },
);
