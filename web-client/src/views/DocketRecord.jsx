import { connect } from '@cerebral/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sequences, state } from 'cerebral';
import React from 'react';

export default connect(
  {
    baseUrl: state.baseUrl,
    caseDetail: state.formattedCaseDetail,
    clearDocumentSequence: sequences.clearDocumentSequence,
    helper: state.caseDetailHelper,
    token: state.token,
    updateCurrentTabSequence: sequences.updateCurrentTabSequence,
  },
  function DocketRecord({
    baseUrl,
    caseDetail,
    clearDocumentSequence,
    helper,
    token,
    updateCurrentTabSequence,
  }) {
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
            {caseDetail.documents.map((document, idx) => (
              <tr key={idx}>
                <td className="responsive-title">
                  <span className="responsive-label">Activity date</span>
                  {document.createdAtFormatted}
                </td>
                <td>
                  <span className="responsive-label">Title</span>
                  {helper.showDirectDownloadLink && (
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
                  {helper.showDocumentDetailLink && (
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
                </td>
                <td>
                  <span className="responsive-label">Filed by</span>
                  {document.filedBy}
                </td>
                <td>
                  <span className="responsive-label">Status</span>
                  {document.isStatusServed && (
                    <span>{caseDetail.datePetitionSentToIrsMessage}</span>
                  )}
                  {helper.showDocumentStatus && <span>{document.status}</span>}
                </td>
                <td />
              </tr>
            ))}
            {helper.showPaymentRecord && (
              <tr>
                <td>{caseDetail.payGovDateFormatted}</td>
                <td>Filing fee paid</td>
                <td />
                <td />
                <td />
              </tr>
            )}
            {helper.showPreferredTrialCity && (
              <tr>
                <td>{caseDetail.createdAtFormatted}</td>
                <td>
                  Request for Place of Trial at {caseDetail.preferredTrialCity}
                </td>
                <td />
                <td />
                <td />
              </tr>
            )}
          </tbody>
        </table>
      </React.Fragment>
    );
  },
);
