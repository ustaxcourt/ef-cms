import { Button } from '../../ustc-ui/Button/Button';
import { ErrorNotification } from '../ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const CaseMessages = connect(
  {
    inboxCount: state.inboxCount || 0,
    messagesHelper: state.messagesHelper,
  },
  function CaseMessages({ inboxCount, messagesHelper }) {
    return (
      <>
        <div className="big-blue-header">
          <div className="grid-container">
            <h1 tabIndex="-1">Messages</h1>
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
          <Tabs bind="messageBoxToDisplay.box">
            <Tab id="inbox-tab" tabName="inbox" title="Inbox">
              <div id="inbox-tab-content"></div>
            </Tab>
            <Tab id="sent-tab" tabName="outbox" title="Sent">
              <div id="sent-tab-content"></div>
            </Tab>
            <Tab id="completed-tab" tabName="completed" title="Completed">
              <div id="completed-tab-content"></div>
            </Tab>
          </Tabs>
        </section>
      </>
    );
  },
);
