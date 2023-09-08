import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { connect } from '@cerebral/react';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

type FilingsAndProceedingsProps = {
  entry: {
    descriptionDisplay: string;
    isStricken: boolean;
    docketEntryId: string;
    showDocumentProcessing: boolean;
    showLinkToDocument: boolean;
    showDocumentViewerLink: boolean;
    eventCode: string;
    showDocumentDescriptionWithoutLink: boolean;
    signatory: string;
    isPaper: boolean;
  };
};

export const FilingsAndProceedings: React.FunctionComponent<FilingsAndProceedingsProps> =
  connect(
    {
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
            </NonMobile>
            <Mobile>
              <Button
                link
                aria-roledescription="button to view document details"
                className="padding-0 border-0"
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
                <span
                  aria-description="document uploading marker"
                  className="usa-tag"
                >
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
                data-test={`document-viewer-link-${entry.eventCode}`}
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
            </>
          )}

          <span
            className={classNames(entry.isStricken && 'stricken-docket-record')}
          >
            {entry.showDocumentDescriptionWithoutLink &&
              entry.descriptionDisplay}
          </span>

          <span> {entry.signatory}</span>

          {entry.isStricken && <span>(STRICKEN)</span>}
        </>
      );
    },
  );

FilingsAndProceedings.displayName = 'FilingsAndProceedings';
