import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SectionWorkQueueOutbox = connect(
  {
    documentHelper: state.documentHelper,
    sectionWorkQueue: state.formattedWorkQueue,
    setFocusedWorkItem: sequences.setFocusedWorkItemSequence,
    workQueueSectionHelper: state.workQueueSectionHelper,
  },
  ({
    documentHelper,
    sectionWorkQueue,
    setFocusedWorkItem,
    workQueueSectionHelper,
  }) => {
    return (
      <table
        className="usa-table work-queue subsection"
        id="section-work-queue"
        aria-describedby="tab-work-queue"
      >
        <thead>
          <tr>
            <th aria-label="Docket Number">Docket</th>
            <th>Sent</th>
            <th>Document</th>
            <th>Status</th>
            <th>From</th>
            <th>To</th>
            <th>Section</th>
          </tr>
        </thead>
        {sectionWorkQueue.map((item, idx) => (
          <tbody key={idx}>
            <tr>
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
                <div className="message-document-detail">
                  {item.currentMessage.message}
                </div>
              </td>
              <td className="message-queue-row">{item.caseStatus}</td>
              <td className="message-queue-row">{item.currentMessage.from}</td>
              <td className="message-queue-row">{item.assigneeName}</td>
              <td className="message-queue-row">
                {workQueueSectionHelper.sectionDisplay(item.section)}
              </td>
            </tr>
          </tbody>
        ))}
      </table>
    );
  },
);
