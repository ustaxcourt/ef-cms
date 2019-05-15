import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';

export const FilingsAndProceedings = connect(
  {
    baseUrl: state.baseUrl,
    caseDetail: state.formattedCaseDetail,
    caseDetailHelper: state.caseDetailHelper,
    document: props.document,
    documentHelper: state.documentHelper,
    record: props.record,
    showDocketRecordDetailModalSequence:
      sequences.showDocketRecordDetailModalSequence,
    token: state.token,
  },
  ({
    record,
    document,
    baseUrl,
    caseDetailHelper,
    caseDetail,
    showDocketRecordDetailModalSequence,
    documentHelper,
    token,
  }) => {
    function renderDocumentLink(
      documentId,
      description,
      isPaper,
      additionalInfo,
      docketRecordIndex = 0,
    ) {
      return (
        <React.Fragment>
          {caseDetailHelper.userHasAccessToCase && (
            <React.Fragment>
              <a
                className="hide-on-mobile"
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
                {description} {additionalInfo}
              </a>
              <button
                className="show-on-mobile link border-0"
                aria-roledescription="button to view document details"
                onClick={() => {
                  showDocketRecordDetailModalSequence({
                    docketRecordIndex,
                    showModal: 'DocketRecordOverlay',
                  });
                }}
              >
                {description} {additionalInfo}
              </button>
            </React.Fragment>
          )}
          {!caseDetailHelper.userHasAccessToCase && description}
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        {document &&
          caseDetailHelper.showDirectDownloadLink &&
          document.processingStatus === 'complete' &&
          renderDocumentLink(
            document.documentId,
            record.description,
            document.isPaper,
            document.additionalInfo,
          )}
        {document &&
          caseDetailHelper.showDirectDownloadLink &&
          document.processingStatus !== 'complete' && (
            <React.Fragment>
              <span
                className="usa-label-uploading"
                aria-label="document uploading marker"
              >
                <span aria-hidden="true">Uploading</span>
              </span>
              {record.description} {document && document.additionalInfo}
            </React.Fragment>
          )}
        {document && caseDetailHelper.showDocumentDetailLink && (
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
            {record.description} {document && document.additionalInfo}
          </a>
        )}
        {!document &&
          record.documentId &&
          renderDocumentLink(
            record.documentId,
            record.description,
            false,
            document.additionalInfo,
          )}
        {!document && !record.documentId && record.description}
        <span className="filings-and-proceedings">
          {record.filingsAndProceedings && ` ${record.filingsAndProceedings}`}
          {document &&
            document.additionalInfo2 &&
            ` ${document.additionalInfo2}`}
        </span>
      </React.Fragment>
    );
  },
);

//internal - document detail link
//external - no access to case (show description only)
//external - access to case (direct download link)
//entry does not have a document
//processing/complete
//isPaper icon
