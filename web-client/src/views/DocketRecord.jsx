import { connect } from '@cerebral/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sequences, state } from 'cerebral';
import React from 'react';

export const DocketRecord = connect(
  {
    baseUrl: state.baseUrl,
    caseDetail: state.formattedCaseDetail,
    clearDocumentSequence: sequences.clearDocumentSequence,
    documentHelper: state.documentHelper,
    helper: state.caseDetailHelper,
    toggleFileDocumentFormSequence: sequences.toggleFileDocumentFormSequence,
    token: state.token,
  },
  ({
    baseUrl,
    caseDetail,
    clearDocumentSequence,
    documentHelper,
    helper,
    toggleFileDocumentFormSequence,
    token,
  }) => {
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
          <button
            id="button-file-document"
            className="usa-button"
            onClick={() => {
              clearDocumentSequence();
              toggleFileDocumentFormSequence({ value: true });
            }}
          >
            <FontAwesomeIcon icon="cloud-upload-alt" />
            File Document
          </button>
        )}
        <table
          className="responsive-table row-border-only"
          id="docket-record"
          aria-label="docket record"
        >
          <thead>
            <tr>
              <th>Date filed</th>
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
                    <span className="responsive-label">Title</span>
                    {document &&
                      helper.showDirectDownloadLink &&
                      renderDocumentLink(
                        document.documentId,
                        document.documentType,
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
                        {document.documentType}
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
