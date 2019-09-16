import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const RecentMessagesInbox = connect(
  {
    documentHelper: state.documentHelper,
    workQueue: state.formattedWorkQueue,
    workQueueHelper: state.workQueueHelper,
  },
  ({ documentHelper, workQueue, workQueueHelper }) => {
    return (
      <React.Fragment>
        <table
          aria-describedby="recent-messages-tab"
          className="usa-table work-queue subsection"
          id="my-recent-messages"
        >
          <thead>
            <tr>
              <th aria-label="Docket Number" colSpan="2">
                <span className="padding-left-2px">Docket</span>
              </th>
              <th>Received</th>
              <th>Document</th>
            </tr>
          </thead>
          {workQueue.slice(0, 5).map((item, idx) => {
            return (
              <tbody key={idx}>
                <tr>
                  <td aria-hidden="true" className="focus-toggle" />
                  <td className="message-queue-row">
                    <a
                      className="no-wrap"
                      href={`/case-detail/${item.docketNumber}`}
                    >
                      {item.docketNumberWithSuffix}
                    </a>
                  </td>
                  <td className="message-queue-row">
                    <span className="no-wrap">{item.received}</span>
                  </td>
                  <td className="message-queue-row message-queue-document">
                    <div className="message-document-title">
                      <a
                        className={
                          item.isRead ? 'case-link' : 'link case-link-bold'
                        }
                        href={documentHelper({
                          docketNumber: item.docketNumber,
                          documentId: item.document.documentId,
                          messageId: item.currentMessage.messageId,
                          workItemIdToMarkAsRead: !item.isRead
                            ? item.workItemId
                            : null,
                        })}
                        onClick={e => {
                          e.stopPropagation();
                        }}
                      >
                        {item.document.documentTitle ||
                          item.document.documentType}
                      </a>
                    </div>
                    {workQueueHelper.showMessageContent && (
                      <div
                        className="message-document-detail"
                        id={`detail-${item.workItemId}`}
                      >
                        {item.currentMessage.message}
                      </div>
                    )}
                  </td>
                </tr>
              </tbody>
            );
          })}
        </table>
      </React.Fragment>
    );
  },
);
