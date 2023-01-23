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
    headerHelper,
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
              {headerHelper.unreadMessageCount > 0 && (
                <div className="icon-unread-messages padding-top-2px text-bold text-ttop text-center">
                  {headerHelper.unreadMessageCount}
                </div>
              )}
            </li>
            <li className="usa-nav__submenu-item">
              <a
                href="/messages/section/inbox/?section=docket"
                id="docket-section-messages"
              >
                Docket Section Messages
              </a>
            </li>
            <li className="usa-nav__submenu-item">
              <a
                href="/messages/section/inbox/?section=petitions"
                id="petitions-section-messages"
              >
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
