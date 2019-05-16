import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const IndividualWorkQueueOutbox = connect(
  {
    documentHelper: state.documentHelper,
    workQueue: state.formattedWorkQueue,
    workQueueSectionHelper: state.workQueueSectionHelper,
  },
  ({ documentHelper, workQueue, workQueueSectionHelper }) => {
    return (
      <React.Fragment>
        <table
          className="usa-table work-queue subsection"
          id="my-work-queue"
          aria-describedby="tab-my-queue"
        >
          <thead>
            <tr>
              <th aria-label="Docket Number" colSpan="2">
                Docket
              </th>
              <th>Sent</th>
              <th>Document</th>
              <th>Status</th>
              <th>To</th>
              <th>Section</th>
            </tr>
          </thead>
          {workQueue.map((item, idx) => (
            <tbody key={idx}>
              <tr>
                <td className="focus-toggle">
                  <button
                    className="focus-button usa-button usa-button--unstyled"
                    aria-label="Expand message detail"
                    aria-expanded={item.isFocused}
                    aria-controls={`detail-${item.workItemId}`}
                  />{' '}
                </td>
                <td className="message-queue-row">
                  {item.docketNumberWithSuffix}
                </td>
                <td className="message-queue-row">{item.sentDateFormatted}</td>
                <td className="message-queue-row">
                  <div className="message-document-title">
                    <a
                      onClick={e => {
                        e.stopPropagation();
                      }}
                      href={documentHelper({
                        docketNumber: item.docketNumber,
                        documentId: item.document.documentId,
                      })}
                      className="case-link"
                    >
                      {item.document.documentType}
                    </a>
                  </div>
                  <div
                    id={`detail-${item.workItemId}`}
                    className="message-document-detail"
                  >
                    {item.currentMessage.message}
                  </div>
                </td>
                <td className="message-queue-row">{item.caseStatus}</td>
                <td className="message-queue-row">{item.assigneeName}</td>
                <td className="message-queue-row">
                  {workQueueSectionHelper.sectionDisplay(item.section)}
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </React.Fragment>
    );
  },
);
