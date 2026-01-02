import { Button } from '../../ustc-ui/Button/Button';
import { ConsolidatedCaseIcon } from '../../ustc-ui/Icon/ConsolidatedCaseIcon';
import { Icon } from '../../ustc-ui/Icon/Icon';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const RecentMessagesInboxCotCDashboard = connect(
  {
    recentMessagesHelper: state.recentMessagesHelper,
  },
  function RecentMessagesInboxCotCDashboard({ recentMessagesHelper }) {
    return (
      <React.Fragment>
        <table
          aria-label="Recent messages table"
          aria-describedby="recent-messages-tab"
          className="usa-table subsection ustc-table"
          id="my-recent-messages"
          data-testid="recent-messages-table"
        >
          <thead>
            <tr>
              <th className="consolidated-case-column"></th>
              <th>
                <div className="sortable-header-button margin-right-0 usa-button margin-right-205 usa-button--unstyled ustc-button--unstyled">
                  Docket No.
                </div>
              </th>
              <th>
                <div className="sortable-header-button margin-right-0 usa-button margin-right-205 usa-button--unstyled ustc-button--unstyled">
                  Received
                </div>
              </th>
              <th className="message-unread-column"></th>
              <th>
                <div className="sortable-header-button margin-right-0 usa-button margin-right-205 usa-button--unstyled ustc-button--unstyled">
                  Message
                </div>
              </th>
              <th>
                <div className="sortable-header-button margin-right-0 usa-button margin-right-205 usa-button--unstyled ustc-button--unstyled no-wrap">
                  Case Title
                </div>
              </th>
              <th>
                <div className="sortable-header-button margin-right-0 usa-button margin-right-205 usa-button--unstyled ustc-button--unstyled">
                  Case Status
                </div>
              </th>
              <th>
                <div className="sortable-header-button margin-right-0 usa-button margin-right-205 usa-button--unstyled ustc-button--unstyled">
                  From
                </div>
              </th>
              <th>
                <div className="sortable-header-button margin-right-0 usa-button margin-right-205 usa-button--unstyled ustc-button--unstyled">
                  Section
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {recentMessagesHelper?.recentMessages?.map(item => {
              return (
                <tr key={item.messageId}>
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
                        aria-label="Unread message"
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
              );
            })}
          </tbody>
        </table>
        {recentMessagesHelper?.recentMessages?.length === 0 && (
          <p>There are no messages.</p>
        )}
      </React.Fragment>
    );
  },
);

RecentMessagesInboxCotCDashboard.displayName =
  'RecentMessagesInboxCotCDashboard';
