import { Button } from '../../ustc-ui/Button/Button';
import { ConsolidatedCaseIcon } from '../../ustc-ui/Icon/ConsolidatedCaseIcon';
import { Icon } from '../../ustc-ui/Icon/Icon';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
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
          className="usa-table ustc-table subsection messages"
          id="my-recent-messages"
        >
          <thead>
            <tr>
              <th aria-hidden="true" className="consolidated-case-column"></th>
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
          {recentMessagesHelper.recentMessages.map(item => {
            return (
              <tbody key={item.messageId}>
                <tr>
                  <td className="consolidated-case-column">
                    <ConsolidatedCaseIcon
                      consolidatedIconTooltipText={
                        item.consolidatedIconTooltipText
                      }
                      inConsolidatedGroup={item.inConsolidatedGroup}
                      showLeadCaseIcon={item.isLeadCase}
                    />
                  </td>
                  <td className="message-queue-row small">
                    {item.docketNumberWithSuffix}
                  </td>
                  <td>{item.createdAtFormatted}</td>
                  <td className="message-unread-column">
                    {!item.isRead && (
                      <Icon
                        aria-label="unread message"
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
                        className={classNames(
                          'padding-0',
                          item.isRead ? '' : 'text-bold',
                        )}
                        data-testid="message-header-link"
                        href={item.messageDetailLink}
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
                  <td className="message-queue-row">{item.caseStatus}</td>
                  <td>{item.from}</td>
                  <td>{item.fromSectionFormatted}</td>
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

RecentMessagesInbox.displayName = 'RecentMessagesInbox';
