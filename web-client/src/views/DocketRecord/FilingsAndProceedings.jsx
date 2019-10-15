import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';

export const FilingsAndProceedings = connect(
  {
    arrayIndex: props.arrayIndex,
    baseUrl: state.baseUrl,
    caseDetailHelper: state.caseDetailHelper,
    document: props.document,
    documentHelper: state.documentHelper,
    formattedCaseDetail: state.formattedCaseDetail,
    record: props.record,
    showDocketRecordDetailModalSequence:
      sequences.showDocketRecordDetailModalSequence,
    token: state.token,
  },
  ({
    arrayIndex,
    baseUrl,
    caseDetailHelper,
    document,
    documentHelper,
    formattedCaseDetail,
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
                <Button
                  link
                  aria-roledescription="button to view document details"
                  className="padding-0 border-0"
                  onClick={() => {
                    showDocketRecordDetailModalSequence({
                      docketRecordIndex,
                      showModal: 'DocketRecordOverlay',
                    });
                  }}
                >
                  {description}
                </Button>
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
              {caseDetailHelper.showDocketRecordInProgressState && (
                <span
                  aria-label="document uploading marker"
                  className="usa-tag"
                >
                  <span aria-hidden="true">Processing</span>
                </span>
              )}
              {record.description}
            </React.Fragment>
          )}

        {document && caseDetailHelper.showDocumentDetailLink && (
          <a
            aria-label="View PDF"
            href={documentHelper({
              docketNumber: formattedCaseDetail.docketNumber,
              documentId: document.documentId,
              shouldLinkToEdit: document.isFileAttached === false,
            })}
          >
            {document && document.isPaper && (
              <span className="filing-type-icon-mobile">
                <FontAwesomeIcon icon={['fas', 'file-alt']} />
              </span>
            )}
            {document.documentTitle || record.description}
          </a>
        )}

        <span> {record.signatory}</span>

        {!document && record.description}

        <span className="filings-and-proceedings">
          {document &&
            document.documentTitle &&
            document.additionalInfo &&
            ` ${document.additionalInfo}`}
          {record.filingsAndProceedings && ` ${record.filingsAndProceedings}`}
          {document &&
            document.additionalInfo2 &&
            ` ${document.additionalInfo2}`}
        </span>
      </React.Fragment>
    );
  },
);
