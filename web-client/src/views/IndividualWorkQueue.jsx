import { connect } from '@cerebral/react';
import React from 'react';
import { state, sequences } from 'cerebral';

export default connect(
  {
    setFocusedWorkItem: sequences.setFocusedWorkItem,
    workQueue: state.formattedWorkQueue,
  },
  function IndividualWorkQueue({ setFocusedWorkItem, workQueue }) {
    return (
      <table
        className="work-queue"
        id="my-work-queue"
        aria-describedby="tab-my-queue"
      >
        <thead>
          <tr>
            <th colSpan="2" aria-label="Docket Number">
              Docket
            </th>
            <th>Received</th>
            <th>Document</th>
            <th>Status</th>
            <th>From</th>
            <th>To</th>
          </tr>
        </thead>
        {workQueue.map(item => (
          <tbody key={item.workItemId}>
            <tr
              onClick={() =>
                setFocusedWorkItem({ workItemId: item.workItemId })
              }
            >
              <td className="focus-toggle">
                <button
                  className="focus-button"
                  aria-label="Expand message detail"
                  aria-expanded={item.isFocused}
                />
              </td>
              <td>{item.docketNumber}</td>
              <td>{item.currentMessage.createdAtFormatted}</td>
              <td>
                <a
                  href={`/case-detail/${item.docketNumber}/documents/${
                    item.document.documentId
                  }`}
                  className="case-link"
                >
                  {item.document.documentType}
                </a>
              </td>
              <td>{item.caseStatus}</td>
              <td>{item.currentMessage.sentBy}</td>
              <td>{item.assigneeName}</td>
            </tr>
            {item.isFocused && (
              <tr
                className="queue-focus queue-message"
                onClick={() =>
                  setFocusedWorkItem({ workItemId: item.workItemId })
                }
              >
                <td className="focus-toggle">
                  <button
                    className="focus-button"
                    tabIndex="-1"
                    aria-disabled="true"
                  />
                </td>
                <td colSpan="2" aria-hidden="true" />
                <td
                  colSpan="4"
                  className="message-detail"
                  aria-label="Message detail"
                >
                  {item.currentMessage.message}
                </td>
              </tr>
            )}
          </tbody>
        ))}
      </table>
    );
  },
);
