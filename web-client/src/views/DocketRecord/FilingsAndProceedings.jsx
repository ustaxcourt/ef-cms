import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';

export const FilingsAndProceedings = connect(
  {
    arrayIndex: props.arrayIndex,
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
    arrayIndex,
    baseUrl,
    caseDetail,
    caseDetailHelper,
    document,
    documentHelper,
    record,
    showDocketRecordDetailModalSequence,
    token,
  }) => {
    function renderDocumentLink(
      documentId,
      description,
      isPaper,
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
                {description}
              </a>
              <button
                className="show-on-mobile usa-button usa-button--unstyled border-0"
                aria-roledescription="button to view document details"
                onClick={() => {
                  showDocketRecordDetailModalSequence({
                    docketRecordIndex,
                    showModal: 'DocketRecordOverlay',
                  });
                }}
              >
                {description}
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
            arrayIndex,
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
              {record.description}
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
            {record.description}
          </a>
        )}

        {!document && record.description}

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
