import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const MessagesMenu = connect(
  {
    headerHelper: state.headerHelper,
    pageIsMessages: state.headerHelper.pageIsMessages,
    resetHeaderAccordionsSequence: sequences.resetHeaderAccordionsSequence,
    toggleMenuSequence: sequences.toggleMenuSequence,
    toggleMobileMenuSequence: sequences.toggleMobileMenuSequence,
  },
  function MessagesMenu({
    isExpanded,
    pageIsMessages,
    resetHeaderAccordionsSequence,
    toggleMenuSequence,
    toggleMobileMenuSequence,
  }) {
    return (
      <>
        <Button
          aria-expanded={isExpanded}
          className={classNames(
            'usa-accordion__button usa-nav__link',
            pageIsMessages && 'usa-current',
            'width-auto',
          )}
          id="messages-btn"
          onClick={() => {
            toggleMenuSequence({ openMenu: 'MessagesMenu' });
          }}
        >
          <span>Messages</span>
        </Button>
        {isExpanded && (
          <ul className="usa-nav__submenu">
            <li className="usa-nav__submenu-item">
              <Button
                link
                href="/messages/my/inbox"
                id="my-messages-btn"
                onClick={() => {
                  resetHeaderAccordionsSequence();
                  toggleMobileMenuSequence();
                }}
              >
                My Messages
              </Button>
            </li>
            <li className="usa-nav__submenu-item">
              <a href="/" id="docket-section-messages" onClick={() => {}}>
                Docket Section Messages
              </a>
            </li>
            <li className="usa-nav__submenu-item">
              <a href="/" id="petitions-section-messages" onClick={() => {}}>
                Petitions Section Messages
              </a>
            </li>
          </ul>
        )}
      </>
    );
  },
);

MessagesMenu.displayName = 'MessagesMenu';
