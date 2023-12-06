import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
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
              <a
                className="margin-right-205"
                href="/messages/my/inbox"
                id="my-messages-btn"
                onClick={() => {
                  resetHeaderAccordionsSequence();
                  toggleMobileMenuSequence();
                }}
              >
                My Messages
              </a>
              {headerHelper.unreadMessageCount > 0 && (
                <div className="icon-unread-messages padding-top-2px text-bold text-ttop text-center display-inline-block">
                  {headerHelper.unreadMessageCount}
                </div>
              )}
            </li>
            <li className="usa-nav__submenu-item">
              <a
                href="/messages/section/inbox/selectedSection?section=docket"
                id="docket-section-messages"
                onClick={() => {
                  resetHeaderAccordionsSequence();
                  toggleMobileMenuSequence();
                }}
              >
                Docket Section Messages
              </a>
            </li>
            <li className="usa-nav__submenu-item">
              <a
                href="/messages/section/inbox/selectedSection?section=petitions"
                id="petitions-section-messages"
                onClick={() => {
                  resetHeaderAccordionsSequence();
                  toggleMobileMenuSequence();
                }}
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
