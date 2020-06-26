import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const RecentMessagesInbox = connect(
  {
    formattedWorkQueue: state.formattedWorkQueue,
    workQueueHelper: state.workQueueHelper,
  },
  function RecentMessagesInbox({ formattedWorkQueue, workQueueHelper }) {
    return (
      <React.Fragment>
        <table
          aria-describedby="recent-messages-tab"
          className="usa-table work-queue subsection"
          id="my-recent-messages"
        >
          <thead>
            <tr>
              <th aria-label="Docket Number" className="small" colSpan="2">
                <span className="padding-left-2px">Docket number</span>
              </th>
              <th className="small">Received</th>
              <th>Case title</th>
              <th>Document</th>
              {workQueueHelper.showCaseStatusColumn && (
                <th className="no-wrap">Case status</th>
              )}
              {workQueueHelper.showFromColumn && <th>From</th>}
            </tr>
          </thead>
          {formattedWorkQueue.slice(0, 5).map((item, idx) => {
            return (
              <tbody key={idx}>
                <tr>
                  <td aria-hidden="true" className="focus-toggle" />
                  <td className="message-queue-row small">
                    <CaseLink formattedCase={item} />
                  </td>
                  <td className="message-queue-row small">
                    <span className="no-wrap">{item.received}</span>
                  </td>
                  <td className="message-queue-row">
                    <span>{item.caseTitle}</span>
                  </td>

                  <td className="message-queue-row message-queue-document">
                    <div className="message-document-title">
                      <a
                        className={
                          item.isRead ? 'case-link' : 'link case-link-bold'
                        }
                        href={item.editLink}
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
                  {workQueueHelper.showCaseStatusColumn && (
                    <td>{item.caseStatus}</td>
                  )}
                  {workQueueHelper.showFromColumn && <td>{item.sentBy}</td>}
                </tr>
              </tbody>
            );
          })}
        </table>
        {formattedWorkQueue.length === 0 && <p>There are no messages.</p>}
      </React.Fragment>
    );
  },
);
