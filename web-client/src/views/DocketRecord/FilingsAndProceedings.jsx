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
              aria-label={`View PDF: ${entry.descriptionDisplay}`}
              className={classNames(
                'text-left',
                entry.isStricken && 'stricken-docket-record',
              )}
              onClick={() =>
                openCaseDocumentDownloadUrlSequence({
                  docketEntryId: entry.docketEntryId,
                  docketNumber: caseDetail.docketNumber,
                })
              }
            >
              {entry.descriptionDisplay}
            </Button>
            {!entry.addToCoversheet && entry.additionalInfoDisplay}
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
                  useSameTab: true,
                });
              }}
            >
              {entry.descriptionDisplay}
            </Button>
            {!entry.addToCoversheet && entry.additionalInfoDisplay}
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
            <span
              className={classNames(
                entry.isStricken && 'stricken-docket-record',
                'margin-right-05',
              )}
            >
              {entry.descriptionDisplay}{' '}
              {!entry.addToCoversheet && entry.additionalInfoDisplay}
            </span>
          </>
        )}

        {entry.showDocumentViewerLink && (
          <>
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
                  viewerDocumentToDisplay: entry,
                })
              }
            >
              {entry.isPaper && (
                <span className="filing-type-icon-mobile">
                  <FontAwesomeIcon
                    icon={['fas', 'file-alt']}
                    title="is paper"
                  />
                </span>
              )}
              {entry.descriptionDisplay}
            </Button>
            {!entry.addToCoversheet && entry.additionalInfoDisplay}
          </>
        )}

        <span
          className={classNames(entry.isStricken && 'stricken-docket-record')}
        >
          {entry.showDocumentDescriptionWithoutLink &&
            entry.formattedDocumentDescriptionWithoutLink}
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
