import { Button } from '../../ustc-ui/Button/Button';
import { CaseMessagesIndividualCompleted } from './CaseMessagesIndividualCompleted';
import { CaseMessagesIndividualInbox } from './CaseMessagesIndividualInbox';
import { CaseMessagesIndividualOutbox } from './CaseMessagesIndividualOutbox';
import { CaseMessagesSectionCompleted } from './CaseMessagesSectionCompleted';
import { CaseMessagesSectionInbox } from './CaseMessagesSectionInbox';
import { CaseMessagesSectionOutbox } from './CaseMessagesSectionOutbox';
import { ErrorNotification } from '../ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CaseMessages = connect(
  {
    inboxCount: state.inboxCount || 0,
    messagesHelper: state.messagesHelper,
    navigateToPathSequence: sequences.navigateToPathSequence,
    queue: state.messageBoxToDisplay.queue,
  },
  function CaseMessages({
    inboxCount,
    messagesHelper,
    navigateToPathSequence,
    queue,
  }) {
    return (
      <>
        <div className="big-blue-header">
          <div className="grid-container">
            <h1 tabIndex="-1">{messagesHelper.messagesTitle}</h1>
            <span
              aria-label="unread messages count"
              className="unread margin-right-2"
            >
              {inboxCount}
            </span>
            {messagesHelper.showIndividualMessages && (
              <Button
                link
                className="button-switch-box"
                href="/case-messages/section/inbox"
              >
                <FontAwesomeIcon icon={['far', 'clone']} />
                Switch to Section Messages
              </Button>
            )}
            {messagesHelper.showSectionMessages && (
              <Button
                link
                className="button-switch-box"
                href="/case-messages/my/inbox"
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
                path: `/case-messages/${queue}/${box}`,
              });
            }}
          >
            <Tab id="inbox-tab" tabName="inbox" title="Inbox">
              <div id="inbox-tab-content">
                {messagesHelper.showIndividualMessages && (
                  <CaseMessagesIndividualInbox />
                )}

                {messagesHelper.showSectionMessages && (
                  <CaseMessagesSectionInbox />
                )}
              </div>
            </Tab>
            <Tab id="sent-tab" tabName="outbox" title="Sent">
              <div id="sent-tab-content">
                {messagesHelper.showIndividualMessages && (
                  <CaseMessagesIndividualOutbox />
                )}

                {messagesHelper.showSectionMessages && (
                  <CaseMessagesSectionOutbox />
                )}
              </div>
            </Tab>
            <Tab id="completed-tab" tabName="completed" title="Completed">
              <div id="completed-tab-content">
                {messagesHelper.showIndividualMessages && (
                  <CaseMessagesIndividualCompleted />
                )}
                {messagesHelper.showSectionMessages && (
                  <CaseMessagesSectionCompleted />
                )}
              </div>
            </Tab>
          </Tabs>
        </section>
      </>
    );
  },
);
