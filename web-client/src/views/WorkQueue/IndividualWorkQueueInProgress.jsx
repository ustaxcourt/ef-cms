import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const IndividualWorkQueueInProgress = connect(
  {
    formattedWorkQueue: state.formattedWorkQueue,
    workQueueHelper: state.workQueueHelper,
  },
  function IndividualWorkQueueInProgress({
    formattedWorkQueue,
    workQueueHelper,
  }) {
    return (
      <React.Fragment>
        <table
          aria-describedby="tab-my-queue"
          className="usa-table ustc-table subsection"
          id="my-work-queue"
        >
          <thead>
            <tr>
              <th aria-label="Docket Number" colSpan="2">
                <span className="padding-left-2px">Docket No.</span>
              </th>
              <th>Received</th>
              <th>Case Title</th>
              <th>Document</th>
              {!workQueueHelper.hideFiledByColumn && <th>Filed By</th>}
              {workQueueHelper.showCaseStatusColumn && <th>Case Status</th>}
              {workQueueHelper.showProcessedByColumn && <th>Processed By</th>}
            </tr>
          </thead>
          {formattedWorkQueue.map(item => {
            return (
              <tbody key={item.workItemId}>
                <tr>
                  <td aria-hidden="true" />
                  <td className="message-queue-row">
                    <CaseLink formattedCase={item} />
                  </td>
                  <td className="message-queue-row">
                    <span className="no-wrap">{item.received}</span>
                  </td>
                  <td className="message-queue-row message-queue-case-title">
                    {item.caseTitle}
                  </td>
                  <td className="message-queue-row max-width-25">
                    <div className="message-document-title">
                      <a className="case-link" href={item.editLink}>
                        {item.docketEntry.descriptionDisplay ||
                          item.docketEntry.documentType}
                      </a>
                    </div>
                  </td>
                  {!workQueueHelper.hideFiledByColumn && (
                    <td className="message-queue-row">
                      {item.docketEntry.filedBy}
                    </td>
                  )}
                  {workQueueHelper.showCaseStatusColumn && (
                    <td className="message-queue-row">{item.caseStatus}</td>
                  )}
                  {workQueueHelper.showProcessedByColumn && (
                    <td>{item.assigneeName}</td>
                  )}
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
