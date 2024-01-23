import { Button } from '../../ustc-ui/Button/Button';
import { ErrorNotification } from '../ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MessagesIndividualCompleted } from './MessagesIndividualCompleted';
import { MessagesIndividualInbox } from './MessagesIndividualInbox';
import { MessagesIndividualOutbox } from './MessagesIndividualOutbox';
import { MessagesSectionCompleted } from './MessagesSectionCompleted';
import { MessagesSectionInbox } from './MessagesSectionInbox';
import { MessagesSectionOutbox } from './MessagesSectionOutbox';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const Messages = connect(
  {
    messagesHelper: state.messagesHelper,
    navigateToPathSequence: sequences.navigateToPathSequence,
    queue: state.messageBoxToDisplay.queue,
    section: state.messageBoxToDisplay.section,
  },
  function Messages({
    messagesHelper,
    navigateToPathSequence,
    queue,
    section,
  }) {
    return (
      <>
        <div className="big-blue-header">
          <div className="grid-container">
            <h1 tabIndex={-1}>{messagesHelper.messagesTitle}</h1>
            <span
              aria-label="unread messages count"
              className="unread margin-right-2"
            ></span>
            {messagesHelper.showSwitchToSectionMessagesButton && (
              <Button
                link
                className="button-switch-box"
                data-testid="switch-to-section-messages-button"
                href="/messages/section/inbox"
              >
                <FontAwesomeIcon icon={['far', 'clone']} />
                Switch to Section Messages
              </Button>
            )}
            {messagesHelper.showSwitchToMyMessagesButton && (
              <Button
                link
                className="button-switch-box"
                href="/messages/my/inbox"
              >
                <FontAwesomeIcon icon={['far', 'clone']} />
                Switch to My Messages
              </Button>
            )}
          </div>
        </div>

        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <Tabs
            bind="messageBoxToDisplay.box"
            onSelect={box => {
              navigateToPathSequence({
                path: messagesHelper.messagesTabNavigationPath({
                  box,
                  queue,
                  section,
                }),
              });
            }}
          >
            <Tab
              id="inbox-tab"
              tabName="inbox"
              title={`Inbox (${messagesHelper.inboxCount})`}
            >
              <div data-testid="inbox-tab-content" id="inbox-tab-content">
                {messagesHelper.showIndividualMessages && (
                  <MessagesIndividualInbox />
                )}

                {messagesHelper.showSectionMessages && <MessagesSectionInbox />}
              </div>
            </Tab>
            <Tab
              data-testid="messages-outbox-tab"
              id="sent-tab"
              tabName="outbox"
              title="Sent"
            >
              <div id="sent-tab-content">
                {messagesHelper.showIndividualMessages && (
                  <MessagesIndividualOutbox />
                )}

                {messagesHelper.showSectionMessages && (
                  <MessagesSectionOutbox />
                )}
              </div>
            </Tab>
            <Tab
              data-testid="messages-completed-tab"
              id="completed-tab"
              tabName="completed"
              title="Completed"
            >
              <div id="completed-tab-content">
                {messagesHelper.showIndividualMessages && (
                  <MessagesIndividualCompleted />
                )}
                {messagesHelper.showSectionMessages && (
                  <MessagesSectionCompleted />
                )}
              </div>
            </Tab>
          </Tabs>
        </section>
      </>
    );
  },
);

Messages.displayName = 'Messages';
