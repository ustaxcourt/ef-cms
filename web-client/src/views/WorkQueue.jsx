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
                    {item.document.documentType || 'Answer'}
                  </a>
                  {item.messages[0].message}
                </td>
                <td>
                  <span className="responsive-label">Trial Date</span>
                  {item.trialDate}
                </td>
                <td>
                  <span className="responsive-label">Sent By</span>
                  {item.messages[0].sentBy || 'Jan Petersen'}
                </td>
                <td>
                  <span className="responsive-label">Received</span>
                  {item.messages[0].receivedDate || 'Dec 31, 1969'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  },
);
