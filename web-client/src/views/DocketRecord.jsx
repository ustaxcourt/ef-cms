import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React, { useEffect } from 'react';

export const DocketRecord = connect(
  {
    baseUrl: state.baseUrl,
    caseDetail: state.formattedCaseDetail,
    clearDocumentSequence: sequences.clearDocumentSequence,
    documentHelper: state.documentHelper,
    helper: state.caseDetailHelper,
    refreshCaseSequence: sequences.refreshCaseSequence,
    token: state.token,
  },
  ({
    baseUrl,
    refreshCaseSequence,
    caseDetail,
    documentHelper,
    helper,
    token,
  }) => {
    useEffect(() => {
      const interval = setInterval(() => {
        refreshCaseSequence();
      }, 30 * 1000);

      return () => {
        clearInterval(interval);
      };
    }, []);

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
            className="docket-record responsive-table row-border-only"
            aria-label="docket record"
          >
            <thead>
              <tr>
                <th className="center-column" aria-label="Number">
                  No.
                </th>
                <th>Date</th>
                <th className="center-column">Event</th>
                <th className="icon-column" aria-hidden="true" />
                <th>Filings and Proceedings</th>
                <th>Filed By</th>
                <th>Action</th>
                <th>Served</th>
                <th className="center-column">Parties</th>
              </tr>
            </thead>
            <tbody>
              {caseDetail.docketRecordWithDocument.map(
                ({ record, document, index }) => (
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
                    <td
                      className="filing-type-icon hide-on-mobile"
                      aria-hidden="true"
                    >
                      {document && document.isPaper && (
                        <FontAwesomeIcon icon={['fas', 'file-alt']} />
                      )}
                      {document &&
                        helper.showDirectDownloadLink &&
                        document.processingStatus !== 'complete' && (
                          <FontAwesomeIcon
                            icon="spinner"
                            className="fa-spin spinner"
                          />
                        )}
                    </td>
                    <td>
                      <span className="responsive-label">
                        Filings and Proceedings
                      </span>
                      {document &&
                        helper.showDirectDownloadLink &&
                        document.processingStatus === 'complete' &&
                        renderDocumentLink(
                          document.documentId,
                          record.description,
                          document.isPaper,
                        )}
                      {document &&
                        helper.showDirectDownloadLink &&
                        document.processingStatus !== 'complete' && (
                          <React.Fragment>
                            <span
                              className="usa-label-uploading"
                              aria-label="document uploading marker"
                            >
                              <span aria-hidden="true">Uploading</span>
                            </span>
                            {record.description}
                          </React.Fragment>
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

        <div className="scrollable-table-container-mobile">
          <table
            className="docket-record mobile-only-extra-table row-border-only"
            aria-label="docket record"
          >
            <thead>
              <tr>
                <th className="center-column">No.</th>
                <th>Date</th>
                <th className="center-column">Event</th>
                <th className="icon-column" />
                <th>Filings and Proceedings</th>
                <th>Filed By</th>
                <th>Action</th>
                <th>Served</th>
                <th className="center-column">Parties</th>
              </tr>
            </thead>
            <tbody>
              {caseDetail.docketRecordWithDocument.map(
                ({ record, document, index }) => (
                  <tr key={index}>
                    <td className="center-column">{index + 1}</td>
                    <td>{record.createdAtFormatted}</td>
                    <td className="center-column">
                      {document && document.eventCode}
                    </td>
                    <td className="filing-type-icon">
                      {document && document.isPaper && (
                        <FontAwesomeIcon icon={['fas', 'file-alt']} />
                      )}
                      {document &&
                        helper.showDirectDownloadLink &&
                        document.processingStatus !== 'complete' && (
                          <FontAwesomeIcon
                            icon="spinner"
                            className="fa-spin spinner"
                          />
                        )}
                    </td>
                    <td>
                      {document &&
                        helper.showDirectDownloadLink &&
                        document.processingStatus === 'complete' &&
                        renderDocumentLink(
                          document.documentId,
                          record.description,
                          document.isPaper,
                        )}
                      {document &&
                        helper.showDirectDownloadLink &&
                        document.processingStatus !== 'complete' && (
                          <React.Fragment>
                            <span
                              className="usa-label-uploading"
                              aria-label="document uploading marker"
                            >
                              <span aria-hidden="true">Uploading</span>
                            </span>
                            {record.description}
                          </React.Fragment>
                        )}
                      {document && helper.showDocumentDetailLink && (
                        <a
                          href={documentHelper({
                            docketNumber: caseDetail.docketNumber,
                            documentId: document.documentId,
                          })}
                          aria-label="View PDF"
                        >
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
                    <td>{document && document.filedBy}</td>
                    <td>{record.action}</td>
                    <td>
                      {document && document.isStatusServed && (
                        <span>{caseDetail.datePetitionSentToIrsMessage}</span>
                      )}
                      {document && helper.showDocumentStatus && (
                        <span>{document.status}</span>
                      )}
                    </td>
                    <td className="center-column">{record.servedParties}</td>
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
