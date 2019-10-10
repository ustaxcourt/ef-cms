import { connect } from '@cerebral/react';
import { state } from 'cerebral';

import React from 'react';

export const MessagesInProgress = connect(
  {
    documentHelper: state.documentHelper,
    extractedPendingMessagesFromCaseDetail:
      state.extractedPendingMessagesFromCaseDetail,
  },
  function MessagesInProgress({
    documentHelper,
    extractedPendingMessagesFromCaseDetail,
  }) {
    return (
      <>
        {extractedPendingMessagesFromCaseDetail.length === 0 && (
          <p className="heading-2 margin-bottom-10">There are no messages.</p>
        )}
        {extractedPendingMessagesFromCaseDetail.length > 0 && (
          <table className="usa-table row-border-only subsection messages">
            <thead>
              <tr>
                <th className="header-fixed-width">To</th>
                <th className="header-fixed-width">From</th>
                <th className="header-fixed-width">Received</th>
                <th>Message</th>
              </tr>
            </thead>

            <tbody>
              {extractedPendingMessagesFromCaseDetail.map((workItem, idx) => (
                <tr key={idx}>
                  <td className="responsive-title padding-extra">
                    {workItem.assigneeName}
                  </td>
                  <td className="padding-extra">{workItem.messages[0].from}</td>
                  <td className="padding-extra">
                    <span className="no-wrap">
                      {workItem.messages[0].createdAtTimeFormatted}
                    </span>
                  </td>
                  <td className="padding-extra">
                    <p className="margin-y-0">
                      <a
                        className="case-link"
                        href={documentHelper({
                          docketNumber: workItem.docketNumber,
                          documentId: workItem.document.documentId,
                          shouldLinkToEdit:
                            workItem.document.isFileAttached === false,
                        })}
                      >
                        {workItem.document.documentTitle ||
                          workItem.document.documentType}
                      </a>
                    </p>
                    <p className="message-detail margin-y-0">
                      {workItem.messages[0].message}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </>
    );
  },
);
