import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const SectionWorkQueueBatched = connect(
  {
    documentHelper: state.documentHelper,
    formattedWorkQueue: state.formattedWorkQueue,
    workQueueHelper: state.workQueueHelper,
  },
  ({ documentHelper, formattedWorkQueue, workQueueHelper }) => {
    return (
      <React.Fragment>
        <table
          aria-describedby="tab-my-queue"
          className="usa-table work-queue subsection"
          id="my-work-queue"
        >
          <thead>
            <tr>
              <th aria-label="Docket Number" colSpan="2">
                <span className="padding-left-2px">Docket</span>
              </th>
              <th>Received</th>
              <th aria-label="Status Icon">&nbsp;</th>
              <th>Document</th>
              <th>Filed By</th>
              <th>Batched</th>
              <th>Batched By</th>
            </tr>
          </thead>
          {formattedWorkQueue.map((item, idx) => {
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
                  <td className="message-queue-row has-icon padding-right-0">
                    {item.showBatchedStatusIcon && (
                      <FontAwesomeIcon
                        aria-hidden="false"
                        aria-label="batched for IRS"
                        className="iconStatusBatched"
                        icon={['far', 'clock']}
                        size="lg"
                      />
                    )}
                  </td>
                  <td className="message-queue-row">
                    <div className="message-document-title">
                      <a
                        className="case-link"
                        href={documentHelper({
                          docketNumber: item.docketNumber,
                          documentId: item.document.documentId,
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
                        {item.completedMessage || item.currentMessage.message}
                      </div>
                    )}
                  </td>
                  <td className="message-queue-row">{item.document.filedBy}</td>
                  <td className="message-queue-row">{item.batchedAt}</td>
                  <td className="message-queue-row">
                    {item.currentMessage.from}
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
