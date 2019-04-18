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
              <th>No.</th>
              <th>Date</th>
              <th>Event</th>
              <th>Filings and Proceedings</th>
              <th>Filed by</th>
              <th>Action</th>
              <th>Served</th>
              <th>Parties</th>
            </tr>
          </thead>
          <tbody>
            {caseDetail.docketRecordWithDocument.map(
              ({ record, document }, index) => (
                <tr key={index}>
                  <td className="responsive-title">{index + 1}</td>
                  <td>
                    <span className="responsive-label">Date</span>
                    {record.createdAtFormatted}
                  </td>
                  <td>
                    <span className="responsive-label">Event</span>
                    CODE
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
                    <span className="responsive-label">Action</span>
                    {record.action}
                  </td>
                  <td>
                    <span className="responsive-label">Served</span>
                    {document && document.isStatusServed && (
                      <span>{caseDetail.datePetitionSentToIrsMessage}</span>
                    )}
                    {document && helper.showDocumentStatus && (
                      <span>{record.status}</span>
                    )}
                  </td>
                  <td>
                    <span className="responsive-label">Parties</span>
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
