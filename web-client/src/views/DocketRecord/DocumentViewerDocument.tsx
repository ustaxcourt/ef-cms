import { Button } from '../../ustc-ui/Button/Button';
import { ConfirmInitiateServiceModal } from '../ConfirmInitiateServiceModal';
import { Icon } from '../../ustc-ui/Icon/Icon';
import { PdfViewer } from '../../ustc-ui/PdfPreview/PdfViewer';
import { WorkItemAlreadyCompletedModal } from '../DocketEntryQc/WorkItemAlreadyCompletedModal';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const DocumentViewerDocument = connect(
  {
    caseDetail: state.caseDetail,
    confirmWorkItemAlreadyCompleteSequence:
      sequences.confirmWorkItemAlreadyCompleteSequence,
    documentViewerHelper: state.documentViewerHelper,
    documentViewerLinksHelper: state.documentViewerLinksHelper,
    gotoCompleteDocketEntryQCSequence:
      sequences.gotoCompleteDocketEntryQCSequence,
    iframeSrc: state.iframeSrc,
    navigateToPathAndSetRedirectUrlSequence:
      sequences.navigateToPathAndSetRedirectUrlSequence,
    openCaseDocumentDownloadUrlSequence:
      sequences.openCaseDocumentDownloadUrlSequence,
    openConfirmServeCourtIssuedDocumentSequence:
      sequences.openConfirmServeCourtIssuedDocumentSequence,
    openConfirmServePaperFiledDocumentSequence:
      sequences.openConfirmServePaperFiledDocumentSequence,
    serveCourtIssuedDocumentSequence:
      sequences.serveCourtIssuedDocumentSequence,
    servePaperFiledDocumentSequence: sequences.servePaperFiledDocumentSequence,
    showModal: state.modal.showModal,
    viewerDocumentToDisplay: state.viewerDocumentToDisplay,
  },
  function DocumentViewerDocument({
    caseDetail,
    confirmWorkItemAlreadyCompleteSequence,
    documentViewerHelper,
    documentViewerLinksHelper,
    gotoCompleteDocketEntryQCSequence,
    iframeSrc,
    navigateToPathAndSetRedirectUrlSequence,
    openCaseDocumentDownloadUrlSequence,
    openConfirmServeCourtIssuedDocumentSequence,
    openConfirmServePaperFiledDocumentSequence,
    serveCourtIssuedDocumentSequence,
    servePaperFiledDocumentSequence,
    showModal,
    viewerDocumentToDisplay,
  }) {
    return (
      <div
        className={classNames(
          'document-viewer--documents',
          !viewerDocumentToDisplay && 'border border-base-lighter',
        )}
      >
        {!viewerDocumentToDisplay && (
          <div className="padding-2">
            There is no document selected for preview
          </div>
        )}

        {viewerDocumentToDisplay && (
          <>
            {documentViewerHelper.showSealedInBlackstone && (
              <div className="sealed-in-blackstone margin-bottom-1">
                <Icon
                  aria-label="sealed case"
                  className="margin-right-1 icon-sealed"
                  icon="lock"
                  size="1x"
                />
                Sealed in Blackstone
              </div>
            )}

            <h3>
              {documentViewerHelper.description}{' '}
              {documentViewerHelper.showStricken && '(STRICKEN)'}
            </h3>

            <div className="grid-row margin-bottom-1">
              <div className="grid-col-6">
                {documentViewerHelper.filedLabel}
              </div>
              <div className="grid-col-6 text-align-right">
                {documentViewerHelper.servedLabel &&
                  documentViewerHelper.servedLabel}
                {documentViewerHelper.showNotServed && (
                  <span className="text-semibold not-served">
                    {documentViewerHelper.showUnservedPetitionWarning
                      ? 'Document cannot be served until the Petition is served.'
                      : 'Not served'}
                  </span>
                )}
              </div>
            </div>

            <div className="message-document-actions">
              {documentViewerHelper.showServeCourtIssuedDocumentButton && (
                <Button
                  link
                  icon="paper-plane"
                  iconColor="white"
                  onClick={() => {
                    openConfirmServeCourtIssuedDocumentSequence({
                      docketEntryId: viewerDocumentToDisplay.docketEntryId,
                      redirectUrl: documentViewerLinksHelper.documentViewerLink,
                    });
                  }}
                >
                  Serve
                </Button>
              )}

              {documentViewerHelper.showServePaperFiledDocumentButton && (
                <Button
                  link
                  data-testid="serve-paper-filed-document"
                  icon="paper-plane"
                  iconColor="white"
                  onClick={() => {
                    openConfirmServePaperFiledDocumentSequence({
                      docketEntryId: viewerDocumentToDisplay.docketEntryId,
                      redirectUrl: documentViewerLinksHelper.documentViewerLink,
                    });
                  }}
                >
                  Serve
                </Button>
              )}

              {documentViewerHelper.showServePetitionButton && (
                <Button
                  link
                  data-testid="review-and-serve-petition"
                  href={documentViewerLinksHelper.reviewAndServePetitionLink}
                  icon="paper-plane"
                  iconColor="white"
                >
                  Review and Serve Petition
                </Button>
              )}

              {documentViewerHelper.showSignStipulatedDecisionButton && (
                <Button
                  link
                  href={documentViewerLinksHelper.signStipulatedDecisionLink}
                  icon="pencil-alt"
                >
                  Sign Stipulated Decision
                </Button>
              )}

              {documentViewerHelper.showCompleteQcButton && (
                <Button
                  link
                  icon="star"
                  onClick={() => {
                    gotoCompleteDocketEntryQCSequence({
                      docketEntryId: viewerDocumentToDisplay.docketEntryId,
                    });
                  }}
                >
                  Complete QC
                </Button>
              )}

              {documentViewerHelper.showApplyStampButton && (
                <Button
                  link
                  data-testid="apply-stamp"
                  icon="stamp"
                  onClick={() => {
                    navigateToPathAndSetRedirectUrlSequence({
                      path: documentViewerLinksHelper.applyStampFromCaseDetailsLink,
                      redirectUrl: documentViewerLinksHelper.redirectUrl,
                    });
                  }}
                >
                  Apply Stamp
                </Button>
              )}

              <Button
                link
                icon="file-pdf"
                iconColor="white"
                onClick={() =>
                  openCaseDocumentDownloadUrlSequence({
                    docketEntryId: viewerDocumentToDisplay.docketEntryId,
                    docketNumber: caseDetail.docketNumber,
                  })
                }
              >
                View Full PDF
              </Button>
            </div>
            {!process.env.CI && (
              <PdfViewer
                src={iframeSrc}
                title={documentViewerHelper.description}
              />
            )}
            {showModal == 'ConfirmInitiateCourtIssuedFilingServiceModal' && (
              <ConfirmInitiateServiceModal
                confirmSequence={serveCourtIssuedDocumentSequence}
                documentTitle={viewerDocumentToDisplay.documentTitle}
              />
            )}
            {showModal == 'ConfirmInitiatePaperFilingServiceModal' && (
              <ConfirmInitiateServiceModal
                confirmSequence={servePaperFiledDocumentSequence}
                documentTitle={viewerDocumentToDisplay.documentTitle}
              />
            )}
            {showModal === 'WorkItemAlreadyCompletedModal' && (
              <WorkItemAlreadyCompletedModal
                confirmSequence={confirmWorkItemAlreadyCompleteSequence}
              />
            )}
          </>
        )}
      </div>
    );
  },
);

DocumentViewerDocument.displayName = 'DocumentViewerDocument';
