import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { Icon } from '../../ustc-ui/Icon/Icon';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const IndividualWorkQueueInbox = connect(
  {
    formattedWorkQueue: state.formattedWorkQueue,
    workQueueHelper: state.workQueueHelper,
  },
  function IndividualWorkQueueInbox({ formattedWorkQueue, workQueueHelper }) {
    return (
      <React.Fragment>
        <table
          aria-describedby="tab-my-queue"
          className="usa-table work-queue subsection"
          id="my-work-queue"
        >
          <thead>
            <tr>
              <th aria-label="Docket Number" className="small" colSpan="2">
                <span className="padding-left-2px">Docket No.</span>
              </th>
              <th className="small">Received</th>
              <th>Case Title</th>
              <th aria-label="Status Icon" className="padding-right-0">
                &nbsp;
              </th>
              <th>Document</th>
              {!workQueueHelper.hideFiledByColumn && <th>Filed by</th>}
              <th>Case Status</th>
            </tr>
          </thead>
          {formattedWorkQueue.map((item, idx) => {
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
                  <td className="message-queue-row message-queue-case-title">
                    {item.caseTitle}
                  </td>
                  <td className="message-queue-row has-icon padding-right-0">
                    {item.showUnreadStatusIcon && (
                      <Icon
                        aria-label="unread message"
                        className="iconStatusUnread"
                        icon={['fas', 'envelope']}
                        size="lg"
                      />
                    )}
                    {item.showHighPriorityIcon && (
                      <Icon
                        aria-label="high priority"
                        className="iconHighPriority"
                        icon={['fas', 'exclamation-circle']}
                        size="lg"
                      />
                    )}
                  </td>
                  <td className="message-queue-row max-width-25">
                    <div className="message-document-title">
                      <a
                        className={
                          item.isRead ? 'case-link' : 'link case-link-bold'
                        }
                        href={item.editLink}
                      >
                        {item.docketEntry.documentTitle ||
                          item.docketEntry.documentType}
                      </a>
                    </div>
                  </td>
                  {!workQueueHelper.hideFiledByColumn && (
                    <td className="message-queue-row">
                      {item.docketEntry.filedBy}
                    </td>
                  )}
                  <td className="message-queue-row">{item.caseStatus}</td>
                </tr>
              </tbody>
            );
          })}
        </table>
        {formattedWorkQueue.length === 0 && <p>There are no documents.</p>}
      </React.Fragment>
    );
  },
);
