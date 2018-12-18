import { connect } from '@cerebral/react';
import React from 'react';
import { state } from 'cerebral';

/**
 * Footer
 */
export default connect(
  {
    workQueue: state.workQueue,
  },
  function WorkQueue({ workQueue }) {
    return (
      <React.Fragment>
        <h1 tabIndex="-1">Work Queue</h1>
        <table className="responsive-table work-queue" id="work-queue">
          <thead>
            <tr>
              <th />
              <th>Message</th>
              <th>Trial Date</th>
              <th>Sent by</th>
              <th>Received</th>
            </tr>
          </thead>
          <tbody>
            {workQueue.map(item => (
              <tr key={item.docketNumber}>
                <td className="responsive-title">
                  <span className="responsive-label">Docket number</span>
                  {item.docketNumber}
                </td>
                <td>
                  <span className="responsive-label">Message</span>
                  <a
                    href={'/case-detail/' + item.docketNumber}
                    className="case-link"
                  >
                    {item.documentType || 'Answer'}
                  </a>
                  {item.message}
                </td>
                <td>
                  <span className="responsive-label">Trial Date</span>
                  {item.receivedDate}
                </td>
                <td>
                  <span className="responsive-label">Sent By</span>
                  {item.sentBy}
                </td>
                <td>
                  <span className="responsive-label">Received</span>
                  {item.receivedDate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  },
);
