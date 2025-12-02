import { WrappedIcon } from '../../ustc-ui/Icon/Icon';
import { Button } from '../../ustc-ui/Button/Button';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';
import _ from 'lodash';

type FilingsAndProceedingsProps = {
  entry: {
    descriptionDisplay: string;
    isStricken: boolean;
    docketEntryId: string;
    relatedDocketEntries: {
      disposition?: string;
      docketEntryId?: string;
      docketEntryIndex?: number;
      showDocumentViewerLink: boolean;
      showDownloadLink: boolean;
    }[];
    showDocumentProcessing: boolean;
    showLinkToDocument: boolean;
    showDocumentViewerLink: boolean;
    eventCode: string;
    showDocumentDescriptionWithoutLink: boolean;
    signatory: string;
    isPaper: boolean;
  };
};

const filingsAndProceedingsDeps = {
  caseDetail: state.caseDetail,
  caseDetailHelper: state.caseDetailHelper,
  changeTabAndSetViewerDocumentToDisplaySequence:
    sequences.changeTabAndSetViewerDocumentToDisplaySequence,
  openCaseDocumentDownloadUrlSequence:
    sequences.openCaseDocumentDownloadUrlSequence,
  showDocketRecordDetailModalSequence:
    sequences.showDocketRecordDetailModalSequence,
};

export const FilingsAndProceedings = connect<
  FilingsAndProceedingsProps,
  typeof filingsAndProceedingsDeps
>(
  filingsAndProceedingsDeps,
  function FilingsAndProceedings({
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
              data-testid={`document-download-link-${entry.eventCode}`}
              onClick={() =>
                openCaseDocumentDownloadUrlSequence({
                  docketEntryId: entry.docketEntryId,
                  docketNumber: caseDetail.docketNumber,
                })
              }
            >
              {entry.descriptionDisplay}
            </Button>
          </NonMobile>
          <Mobile>
            <Button
              link
              aria-roledescription="button to view document details"
              className={classNames(
                'text-left',
                'padding-0',
                'border-0',
                entry.isStricken && 'stricken-docket-record',
              )}
              onClick={() => {
                showDocketRecordDetailModalSequence({
                  entry,
                  showModal: 'DocketRecordOverlay',
                  useSameTab: true,
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
            <span
              className={classNames(
                entry.isStricken && 'stricken-docket-record',
                'margin-right-05',
              )}
            >
              {entry.descriptionDisplay}
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
              data-testid={`document-viewer-link-${entry.eventCode}`}
              onClick={() =>
                changeTabAndSetViewerDocumentToDisplaySequence({
                  docketRecordTab: 'documentView',
                  viewerDocumentToDisplay: entry,
                })
              }
            >
              {entry.isPaper && (
                <span className="filing-type-icon-mobile">
                  <WrappedIcon icon={['fas', 'file-alt']} title="Is paper" />
                </span>
              )}
              {entry.descriptionDisplay}
            </Button>
          </>
        )}
        <span
          className={classNames(entry.isStricken && 'stricken-docket-record')}
        >
          {entry.showDocumentDescriptionWithoutLink && entry.descriptionDisplay}
        </span>
        <span> {entry.signatory}</span>
        {entry.isStricken && <span>(STRICKEN)</span>}
        {entry.relatedDocketEntries?.map(affectedEntry => {
          return (
            <>
              <br></br>
              <span className="display-inline-block">
                <span> --- </span>
                {(affectedEntry.showDocumentViewerLink ||
                  affectedEntry.showDownloadLink) && (
                  <Button
                    link
                    className={classNames('text-right', 'view-pdf-link')}
                    data-testid={`related-document-viewer-link-${affectedEntry.docketEntryIndex}`}
                    arial-label={`View PDF for: ${affectedEntry.docketEntryIndex}`}
                    onClick={() =>
                      affectedEntry.showDocumentViewerLink
                        ? changeTabAndSetViewerDocumentToDisplaySequence({
                            docketRecordTab: 'documentView',
                            viewerDocumentToDisplay: {
                              docketEntryId: affectedEntry.docketEntryId,
                            },
                          })
                        : openCaseDocumentDownloadUrlSequence({
                            docketEntryId: affectedEntry.docketEntryId,
                            docketNumber: caseDetail.docketNumber,
                          })
                    }
                  >
                    {affectedEntry?.disposition} #
                    {affectedEntry.docketEntryIndex}
                  </Button>
                )}
                {!(
                  affectedEntry.showDocumentViewerLink ||
                  affectedEntry.showDownloadLink
                ) && (
                  <span>
                    {' '}
                    {affectedEntry?.disposition} #
                    {affectedEntry.docketEntryIndex}{' '}
                  </span>
                )}
              </span>
            </>
          );
        })}
      </>
    );
  },
);

FilingsAndProceedings.displayName = 'FilingsAndProceedings';
