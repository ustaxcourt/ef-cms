import { connect } from '@cerebral/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sequences, state } from 'cerebral';
import React from 'react';

export const DocketRecord = connect(
  {
    baseUrl: state.baseUrl,
    caseDetail: state.formattedCaseDetail,
    clearDocumentSequence: sequences.clearDocumentSequence,
    helper: state.caseDetailHelper,
    token: state.token,
    updateCurrentTabSequence: sequences.updateCurrentTabSequence,
  },
  ({
    baseUrl,
    caseDetail,
    clearDocumentSequence,
    helper,
    token,
    updateCurrentTabSequence,
  }) => {
    const documentMap = caseDetail.documents.reduce((acc, document) => {
      acc[document.documentId] = document;
      return acc;
    }, {});

    const docketRecordMap = mapFn => {
      return caseDetail.docketRecord.map((record, idx) => {
        let document;

        if (record.documentId) {
          document = documentMap[record.documentId];
        }
        return mapFn(record, document, idx);
      });
    };

    return (
      <React.Fragment>
        {helper.showFileDocumentButton && (
          <button
            id="button-file-document"
            className="usa-button"
            onClick={() => {
              clearDocumentSequence();
              updateCurrentTabSequence({ value: 'File Document' });
            }}
          >
            <FontAwesomeIcon icon="cloud-upload-alt" />
            File Document
          </button>
        )}
        <table
          className="responsive-table"
          id="docket-record"
          aria-label="docket record"
        >
          <thead>
            <tr>
              <th>Date filed</th>
              <th>Title</th>
              <th>Filed by</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {docketRecordMap((record, document, idx) => (
              <tr key={idx}>
                <td className="responsive-title">
                  <span className="responsive-label">Activity date</span>
                  {record.createdAtFormatted}
                </td>
                <td>
                  <span className="responsive-label">Title</span>
                  {document && helper.showDirectDownloadLink && (
                    <a
                      href={`${baseUrl}/documents/${
                        document.documentId
                      }/documentDownloadUrl?token=${token}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`View PDF: ${document.documentType}`}
                    >
                      <FontAwesomeIcon icon="file-pdf" />
                      {document.documentType}
                    </a>
                  )}
                  {document && helper.showDocumentDetailLink && (
                    <a
                      href={`/case-detail/${
                        caseDetail.docketNumber
                      }/documents/${document.documentId}`}
                      aria-label="View PDF"
                    >
                      <FontAwesomeIcon icon="file-pdf" />
                      {document.documentType}
                    </a>
                  )}
                  {!document && record.description}
                </td>
                <td>
                  <span className="responsive-label">Filed by</span>
                  {record.filedBy}
                </td>
                <td>
                  <span className="responsive-label">Status</span>
                  {document && document.isStatusServed && (
                    <span>{caseDetail.datePetitionSentToIrsMessage}</span>
                  )}
                  {document && helper.showDocumentStatus && (
                    <span>{document.status}</span>
                  )}
                </td>
                <td />
              </tr>
            ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  },
);
