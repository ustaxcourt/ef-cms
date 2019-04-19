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
    refreshCaseSequence,
    baseUrl,
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

    function renderDocumentLink(documentId, description) {
      return (
        <a
          href={`${baseUrl}/documents/${documentId}/documentDownloadUrl?token=${token}`}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={`View PDF: ${description}`}
        >
          <FontAwesomeIcon icon={['far', 'file-pdf']} />
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
        <table
          className="responsive-table row-border-only"
          id="docket-record"
          aria-label="docket record"
        >
          <thead>
            <tr>
              <th>Date filed</th>
              <th className="icon-column" />
              <th>Title</th>
              <th>Filed by</th>
              <th>Served</th>
            </tr>
          </thead>
          <tbody>
            {caseDetail.docketRecordWithDocument.map(
              ({ record, document, index }) => (
                <tr key={index}>
                  <td className="responsive-title">
                    <span className="responsive-label">Activity date</span>
                    {record.createdAtFormatted}
                  </td>
                  <td>
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
                    <span className="responsive-label">Title</span>
                    {document &&
                      helper.showDirectDownloadLink &&
                      document.processingStatus === 'complete' &&
                      renderDocumentLink(
                        document.documentId,
                        record.description,
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
                        <FontAwesomeIcon icon={['far', 'file-pdf']} />
                        {record.description}
                      </a>
                    )}
                    {!document &&
                      record.documentId &&
                      renderDocumentLink(record.documentId, record.description)}
                    {!document && !record.documentId && record.description}
                  </td>
                  <td>
                    <span className="responsive-label">Filed by</span>
                    {record.filedBy}
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
                </tr>
              ),
            )}
          </tbody>
        </table>
      </React.Fragment>
    );
  },
);
