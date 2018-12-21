import { connect } from '@cerebral/react';
import React from 'react';
import { state } from 'cerebral';

export default connect(
  {
    workQueue: state.formattedWorkQueue,
  },
  function WorkQueue({ workQueue }) {
    return (
      <React.Fragment>
        <h1 tabIndex="-1">Work Queue</h1>
        <table className="responsive-table work-queue" id="work-queue">
          <thead>
            <tr>
              <th aria-label="Docket Number" />
              <th>Message</th>
              <th>Trial Date</th>
              <th>Sent by</th>
              <th>Received</th>
            </tr>
          </thead>
          <tbody>
            {workQueue.map(item => (
              <tr key={item.workItemId}>
                <td className="responsive-title">
                  <span className="responsive-label">Docket number</span>
                  {item.docketNumber}
                </td>
                <td>
                  <span className="responsive-label">Message</span>
                  <a
                    href={`/case-detail/${item.docketNumber}/documents/${
                      item.document.documentId
                    }`}
                    className="case-link"
                  >
                    {item.document.documentType}
                  </a>
                  {item.messages[0].message}
                </td>
                <td>
                  <span className="responsive-label">Trial Date</span>
                  {item.trialDate}
                </td>
                <td>
                  <span className="responsive-label">Sent By</span>
                  {item.messages[0].sentBy}
                </td>
                <td>
                  <span className="responsive-label">Received</span>
                  {item.messages[0].createdAtFormatted}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  },
);
