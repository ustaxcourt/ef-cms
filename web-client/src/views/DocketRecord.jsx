import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const DocketRecord = connect(
  {
    baseUrl: state.baseUrl,
    caseDetail: state.formattedCaseDetail,
    clearDocumentSequence: sequences.clearDocumentSequence,
    documentHelper: state.documentHelper,
    helper: state.caseDetailHelper,
    token: state.token,
  },
  ({ baseUrl, caseDetail, documentHelper, helper, token }) => {
    function renderDocumentLink(documentId, description, isPaper) {
      return (
        <a
          href={`${baseUrl}/documents/${documentId}/documentDownloadUrl?token=${token}`}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={`View PDF: ${description}`}
        >
          {isPaper && (
            <span className="filing-type-icon-mobile">
              <FontAwesomeIcon icon={['fas', 'file-alt']} />
            </span>
          )}
          {description}
        </a>
      );
    }

    return (
      <React.Fragment>
        {helper.showFileDocumentButton && (
          <a
            className="usa-button"
            href={`/case-detail/${caseDetail.docketNumber}/file-a-document`}
            id="button-file-document"
          >
            <FontAwesomeIcon icon="cloud-upload-alt" /> File Document
          </a>
        )}
        <div className="scrollable-table-container">
          <table
            className="responsive-table row-border-only"
            id="docket-record"
            aria-label="docket record"
          >
            <thead>
              <tr>
                <th className="center-column">No.</th>
                <th>Date</th>
                <th className="center-column">Event</th>
                <th />
                <th>Filings and Proceedings</th>
                <th>Filed By</th>
                <th>Action</th>
                <th>Served</th>
                <th className="center-column">Parties</th>
              </tr>
            </thead>
            <tbody>
              {caseDetail.docketRecordWithDocument.map(
                ({ record, document }, index) => (
                  <tr key={index}>
                    <td className="responsive-title center-column">
                      {index + 1}
                      <span className="responsive-label push-right">
                        {record.createdAtFormatted}
                      </span>
                    </td>
                    <td className="hide-on-mobile">
                      <span className="responsive-label">Date</span>
                      {record.createdAtFormatted}
                    </td>
                    <td className="center-column">
                      <span className="responsive-label">Event</span>
                      {document && document.eventCode}
                    </td>
                    <td className="filing-type-icon hide-on-mobile">
                      {document && document.isPaper && (
                        <FontAwesomeIcon icon={['fas', 'file-alt']} />
                      )}
                    </td>
                    <td>
                      <span className="responsive-label">
                        Filings and Proceedings
                      </span>
                      {document &&
                        helper.showDirectDownloadLink &&
                        renderDocumentLink(
                          document.documentId,
                          record.description,
                          document.isPaper,
                        )}
                      {document && helper.showDocumentDetailLink && (
                        <a
                          href={documentHelper({
                            docketNumber: caseDetail.docketNumber,
                            documentId: document.documentId,
                          })}
                          aria-label="View PDF"
                        >
                          {document && document.isPaper && (
                            <span className="filing-type-icon-mobile">
                              <FontAwesomeIcon icon={['fas', 'file-alt']} />
                            </span>
                          )}
                          {record.description}
                        </a>
                      )}
                      {!document &&
                        record.documentId &&
                        renderDocumentLink(
                          record.documentId,
                          record.description,
                        )}
                      {!document && !record.documentId && record.description}
                      {record.filingsAndProceedings &&
                        ` ${record.filingsAndProceedings}`}
                    </td>
                    <td>
                      <span className="responsive-label">Filed by</span>
                      {document && document.filedBy}
                    </td>
                    <td>
                      <span className="responsive-label">Action</span>
                      {record.action}
                    </td>
                    <td>
                      <span className="responsive-label">Served</span>
                      {document && document.isStatusServed && (
                        <span>{caseDetail.datePetitionSentToIrsMessage}</span>
                      )}
                      {document && helper.showDocumentStatus && (
                        <span>{document.status}</span>
                      )}
                    </td>
                    <td className="center-column">
                      <span className="responsive-label">Parties</span>
                      {record.servedParties}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </React.Fragment>
    );
  },
);
