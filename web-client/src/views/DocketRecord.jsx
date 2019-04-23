import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React, { useEffect } from 'react';

import { DocketRecordOverlay } from './DocketRecordOverlay';

export const DocketRecord = connect(
  {
    baseUrl: state.baseUrl,
    caseDetail: state.formattedCaseDetail,
    clearDocumentSequence: sequences.clearDocumentSequence,
    documentHelper: state.documentHelper,
    helper: state.caseDetailHelper,
    refreshCaseSequence: sequences.refreshCaseSequence,
    setModalDialogNameSequence: sequences.setModalDialogNameSequence,
    showModal: state.showModal,
    token: state.token,
  },
  ({
    baseUrl,
    refreshCaseSequence,
    caseDetail,
    documentHelper,
    helper,
    setModalDialogNameSequence,
    showModal,
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
              ({ record, document, index }, arrayIndex) => (
                <tr key={index}>
                  <td className="center-column hide-on-mobile">{index}</td>
                  <td>{record.createdAtFormatted}</td>
                  <td className="center-column hide-on-mobile">
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
                      renderDocumentLink(record.documentId, record.description)}
                    {!document && !record.documentId && record.description}
                    {record.filingsAndProceedings && (
                      <>
                        {' '}
                        <span className="filings-and-proceedings">
                          {record.filingsAndProceedings}
                        </span>
                      </>
                    )}
                    <button
                      className="show-on-mobile"
                      onClick={() =>
                        // setDocketIndex(arrayIndex);
                        setModalDialogNameSequence({
                          showModal: 'DocketRecordOverlay',
                        })
                      }
                    >
                      Details {arrayIndex}
                    </button>
                    {showModal == 'DocketRecordOverlay' && (
                      <DocketRecordOverlay />
                    )}
                  </td>
                  <td className="hide-on-mobile">
                    {document && document.filedBy}
                  </td>
                  <td className="hide-on-mobile">{record.action}</td>
                  <td>
                    {document && document.isStatusServed && (
                      <span>{caseDetail.datePetitionSentToIrsMessage}</span>
                    )}
                    {document && helper.showDocumentStatus && (
                      <span>{document.status}</span>
                    )}
                  </td>
                  <td className="center-column hide-on-mobile">
                    <span className="responsive-label">Parties</span>
                    {record.servedParties}
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
