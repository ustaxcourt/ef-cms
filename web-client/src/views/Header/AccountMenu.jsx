import { Button } from '../../ustc-ui/Button/Button';
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
  function AccountMenu({
    headerHelper,
    isExpanded,
    signOutSequence,
    toggleMenuSequence,
  }) {
    return (
      <>
        <ul className="usa-nav__primary usa-accordion nav-large">
          <li
            className={classNames(
              'usa-nav__primary-item',
              isExpanded && 'usa-nav__submenu--open',
            )}
          >
            <Button
              aria-expanded={isExpanded}
              className={classNames(
                'usa-accordion__button usa-nav__link hidden-underline',
              )}
              icon={['far', 'user']}
              title={`Hello, ${headerHelper.userName}`}
              onClick={() => {
                toggleMenuSequence({ openMenu: 'AccountMenu' });
              }}
            />
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
      </>
    );
  },
);
