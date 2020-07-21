import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const FilingsAndProceedings = connect(
  {
    arrayIndex: props.arrayIndex,
    caseDetail: state.caseDetail,
    caseDetailHelper: state.caseDetailHelper,
    changeTabAndSetViewerDocumentToDisplaySequence:
      sequences.changeTabAndSetViewerDocumentToDisplaySequence,
    entry: props.entry,
    openCaseDocumentDownloadUrlSequence:
      sequences.openCaseDocumentDownloadUrlSequence,
    showDocketRecordDetailModalSequence:
      sequences.showDocketRecordDetailModalSequence,
  },
  function FilingsAndProceedings({
    arrayIndex,
    caseDetail,
    caseDetailHelper,
    changeTabAndSetViewerDocumentToDisplaySequence,
    entry,
    openCaseDocumentDownloadUrlSequence,
    showDocketRecordDetailModalSequence,
  }) {
    const renderDocumentLink = () => {
      return (
        <>
          <NonMobile>
            <Button
              link
              aria-label={`View PDF: ${entry.description}`}
              className={classNames(
                entry.isStricken && 'stricken-docket-record',
              )}
              onClick={() =>
                openCaseDocumentDownloadUrlSequence({
                  caseId: caseDetail.caseId,
                  documentId: entry.documentId,
                })
              }
            >
              {entry.isPaper && (
                <span className="filing-type-icon-mobile">
                  <FontAwesomeIcon icon={['fas', 'file-alt']} />
                </span>
              )}
              {entry.descriptionDisplay}
            </Button>
          </NonMobile>
          <Mobile>
            <Button
              link
              aria-roledescription="button to view document details"
              className="padding-0 border-0"
              onClick={() => {
                showDocketRecordDetailModalSequence({
                  docketRecordIndex: arrayIndex,
                  showModal: 'DocketRecordOverlay',
                });
              }}
            >
              {entry.descriptionDisplay}
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

        {entry.showDocumentViewerLink && (
          <Button
            link
            aria-label="View PDF"
            className={classNames(
              'text-left',
              entry.isStricken && 'stricken-docket-record',
              'view-pdf-link',
            )}
            onClick={() =>
              changeTabAndSetViewerDocumentToDisplaySequence({
                docketRecordTab: 'documentView',
                viewerDocumentToDisplay: { documentId: entry.documentId },
              })
            }
          >
            {entry.isPaper && (
              <span className="filing-type-icon-mobile">
                <FontAwesomeIcon icon={['fas', 'file-alt']} />
              </span>
            )}
            {entry.descriptionDisplay}
          </Button>
        )}

        <span
          className={classNames(entry.isStricken && 'stricken-docket-record')}
        >
          {entry.showDocumentDescriptionWithoutLink && entry.descriptionDisplay}
        </span>

        <span> {entry.signatory}</span>

        <span className="filings-and-proceedings">
          {entry.filingsAndProceedingsWithAdditionalInfo}
        </span>

        {entry.isStricken && <span>(STRICKEN)</span>}
      </>
    );
  },
);
