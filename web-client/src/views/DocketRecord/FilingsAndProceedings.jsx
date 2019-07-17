import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
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
    const renderDocumentLink = (
      documentId,
      description,
      isPaper,
      docketRecordIndex = 0,
    ) => {
      return (
        <React.Fragment>
          {caseDetailHelper.userHasAccessToCase && (
            <React.Fragment>
              <NonMobile>
                <a
                  aria-label={`View PDF: ${description}`}
                  href={`${baseUrl}/documents/${documentId}/document-download-url?token=${token}`}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  {isPaper && (
                    <span className="filing-type-icon-mobile">
                      <FontAwesomeIcon icon={['fas', 'file-alt']} />
                    </span>
                  )}
                  {description}
                </a>
              </NonMobile>
              <Mobile>
                <button
                  aria-roledescription="button to view document details"
                  className="usa-button usa-button--unstyled border-0"
                  onClick={() => {
                    showDocketRecordDetailModalSequence({
                      docketRecordIndex,
                      showModal: 'DocketRecordOverlay',
                    });
                  }}
                >
                  {description}
                </button>
              </Mobile>
            </React.Fragment>
          )}
          {!caseDetailHelper.userHasAccessToCase && description}
        </React.Fragment>
      );
    };

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
              <span aria-label="document uploading marker" className="usa-tag">
                <span aria-hidden="true">Uploading</span>
              </span>
              {record.description}
            </React.Fragment>
          )}

        {document && caseDetailHelper.showDocumentDetailLink && (
          <a
            aria-label="View PDF"
            href={documentHelper({
              docketNumber: caseDetail.docketNumber,
              documentId: document.documentId,
            })}
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
