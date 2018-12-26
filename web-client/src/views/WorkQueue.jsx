import { connect } from '@cerebral/react';
import React from 'react';
import { state, sequences } from 'cerebral';

export default connect(
  {
    workQueue: state.formattedWorkQueue,
    users: state.users,
    selectAssigneeSequence: sequences.selectAssigneeSequence,
  },
  function WorkQueue({ workQueue, users, selectAssigneeSequence }) {
    return (
      <React.Fragment>
        <h1 tabIndex="-1">Work Queue</h1>
        <div className="horizontal-tabs subsection">
          <ul>
            <li className="active">
              <h2>My Queue</h2>
            </li>
            <li>
              <h2>Section Queue</h2>
            </li>
          </ul>
        </div>
        <div className="work-queue-tab-container">
          <h3 className="work-queue-tab">Inbox</h3>
        </div>
        <table className="work-queue" id="work-queue">
          <thead>
            <tr>
              <th>Select</th>
              <th aria-label="Docket Number">Docket</th>
              <th>Received</th>
              <th>Document</th>
              <th>Status</th>
              <th>Due</th>
              <th>From</th>
              <th>To</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="8" className="action-bar">
                <span className="selected-count">2 selected</span>
                <label htmlFor="options">Send to</label>
                <select
                  onChange={event =>
                    selectAssigneeSequence({
                      assigneeId: event.target.value,
                      assigneeName:
                        event.target.options[event.target.selectedIndex].text,
                    })
                  }
                  name="options"
                  id="options"
                >
                  <option value>- Select -</option>
                  {users.map(user => (
                    <option key={user.userId} value={user.userId}>
                      {user.name}
                    </option>
                  ))}
                </select>
                <button className="usa-button">Send</button>
              </td>
            </tr>
            {workQueue.map(item => (
              <tr key={item.workItemId}>
                <td>
                  <input
                    id={item.workItemId}
                    type="checkbox"
                    name="historical-figures-1"
                    value={item.workItemId}
                    checked
                  />
                  <label htmlFor={item.workItemId} />
                </td>
                <td>{item.docketNumber}</td>
                <td>Received</td>
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
                <td>General Docket</td>
                <td>12/15/2018</td>
                <td>{item.messages[0].sentBy}</td>
                <td>Unassigned</td>
              </tr>
            ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  },
);
