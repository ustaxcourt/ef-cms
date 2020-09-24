import { Button } from '../../ustc-ui/Button/Button';
import { Icon } from '../../ustc-ui/Icon/Icon';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const RecentMessagesInbox = connect(
  {
    recentMessagesHelper: state.recentMessagesHelper,
  },
  function RecentMessagesInbox({ recentMessagesHelper }) {
    return (
      <React.Fragment>
        <table
          aria-describedby="recent-messages-tab"
          className="usa-table work-queue subsection messages"
          id="my-recent-messages"
        >
          <thead>
            <tr>
              <th aria-label="Docket Number" className="small">
                <span className="padding-left-2px">Docket Number</span>
              </th>
              <th className="small">Received</th>
              <th className="message-unread-column"></th>
              <th>Message</th>
              <th>Case Title</th>
              <th className="no-wrap">Case Status</th>
              <th>From</th>
              <th>Section</th>
            </tr>
          </thead>
          {recentMessagesHelper.recentMessages.map((item, idx) => {
            const unreadClass = item.isRead ? '' : 'text-bold';

            return (
              <tbody key={idx}>
                <tr>
                  <td>{item.createdAtFormatted}</td>
                  <td className="message-queue-row small">
                    {item.docketNumberWithSuffix}
                  </td>
                  <td className="message-unread-column">
                    {!item.isRead && (
                      <Icon
                        aria-label="create message"
                        className="fa-icon-blue"
                        icon="envelope"
                        size="1x"
                      />
                    )}
                  </td>
                  <td>
                    <div className="message-document-title">
                      <Button
                        link
                        className={classNames('padding-0', unreadClass)}
                        href={`/messages/${item.docketNumber}/message-detail/${item.parentMessageId}`}
                      >
                        {item.subject}
                      </Button>
                    </div>
                    <div className="message-document-detail">
                      {item.message}
                    </div>
                  </td>
                  <td className="message-queue-row">
                    <span>{item.caseTitle}</span>
                  </td>
                  <td>{item.caseStatus}</td>
                  <td>{item.from}</td>
                  <td>{item.fromSection}</td>
                </tr>
              </tbody>
            );
          })}
        </table>
        {recentMessagesHelper.recentMessages.length === 0 && (
          <p>There are no messages.</p>
        )}
      </React.Fragment>
    );
  },
);
