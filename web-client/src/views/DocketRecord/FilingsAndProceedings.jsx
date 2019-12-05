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
    docketRecordHelper: state.docketRecordHelper,
    documentEditLinkHelper: state.documentEditLinkHelper,
    entry: props.entry,
    formattedCaseDetail: state.formattedCaseDetail,
    showDocketRecordDetailModalSequence:
      sequences.showDocketRecordDetailModalSequence,
    token: state.token,
  },
  ({
    arrayIndex,
    baseUrl,
    caseDetailHelper,
    docketRecordHelper,
    documentEditLinkHelper,
    entry,
    formattedCaseDetail,
    showDocketRecordDetailModalSequence,
    token,
  }) => {
    const renderDocumentLink = () => {
      return (
        <>
          <NonMobile>
            <a
              aria-label={`View PDF: ${entry.description}`}
              href={`${baseUrl}/documents/${entry.documentId}/document-download-url?token=${token}`}
              rel="noreferrer noopener"
              target="_blank"
            >
              {entry.isPaper && (
                <span className="filing-type-icon-mobile">
                  <FontAwesomeIcon icon={['fas', 'file-alt']} />
                </span>
              )}
              {entry.description}
            </a>
          </NonMobile>
          <Mobile>
            <Button
              link
              aria-roledescription="button to view document details"
              className="padding-0 border-0"
              onClick={() => {
                showDocketRecordDetailModalSequence({
                  arrayIndex,
                  showModal: 'DocketRecordOverlay',
                });
              }}
            >
              {entry.description}
            </Button>
          </Mobile>
        </>
      );
    };

    return (
      <>
        {entry.showLinkToDocument && renderDocumentLink()}

        {entry.showDocumentProcessing && (
          <>
            {caseDetailHelper.showDocketRecordInProgressState && (
              <span aria-label="document uploading marker" className="usa-tag">
                <span aria-hidden="true">Processing</span>
              </span>
            )}
            {entry.description}
          </>
        )}

        {entry.showDocumentEditLink && (
          <a
            aria-label="View PDF"
            href={documentEditLinkHelper({
              docketNumber: formattedCaseDetail.docketNumber,
              documentId: entry.documentId,
              shouldLinkToComplete: entry.isFileAttached === false,
              shouldLinkToEdit:
                docketRecordHelper.showEditDocketEntry && entry.canEdit,
              shouldLinkToEditCourtIssued:
                docketRecordHelper.showEditDocketEntry &&
                entry.isCourtIssuedDocument,
              shouldLinkedToDetails: entry.isServed,
            })}
          >
            {entry.isPaper && (
              <span className="filing-type-icon-mobile">
                <FontAwesomeIcon icon={['fas', 'file-alt']} />
              </span>
            )}
            {entry.descriptionDisplay}
          </a>
        )}

        {entry.showDocumentDescriptionWithoutLink && entry.descriptionDisplay}

        <span> {entry.signatory}</span>

        {!entry.hasDocument && entry.description}

        <span className="filings-and-proceedings">
          {entry.filingsAndProceedingsWithAdditionalInfo}
        </span>
      </>
    );
  },
);
