import { Button } from '../../ustc-ui/Button/Button';
import { ConfirmInitiateServiceModal } from '../ConfirmInitiateServiceModal';
import { Icon } from '../../ustc-ui/Icon/Icon';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const DocumentViewerDocument = connect(
  {
    caseDetail: state.caseDetail,
    documentViewerHelper: state.documentViewerHelper,
    iframeSrc: state.iframeSrc,
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
    documentViewerHelper,
    iframeSrc,
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

            <h3>{documentViewerHelper.description}</h3>

            <div className="grid-row margin-bottom-1">
              <div className="grid-col-6">
                {documentViewerHelper.filedLabel}
              </div>
              <div className="grid-col-6 text-align-right">
                {documentViewerHelper.servedLabel &&
                  documentViewerHelper.servedLabel}
                {documentViewerHelper.showNotServed && (
                  <span className="text-semibold not-served">Not served</span>
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
                      documentId: viewerDocumentToDisplay.documentId,
                      redirectUrl: `/case-detail/${caseDetail.docketNumber}/document-view?documentId=${viewerDocumentToDisplay.documentId}`,
                    });
                  }}
                >
                  Serve
                </Button>
              )}

              {documentViewerHelper.showServePaperFiledDocumentButton && (
                <Button
                  link
                  icon="paper-plane"
                  iconColor="white"
                  onClick={() => {
                    openConfirmServePaperFiledDocumentSequence({
                      documentId: viewerDocumentToDisplay.documentId,
                      redirectUrl: `/case-detail/${caseDetail.docketNumber}/document-view?documentId=${viewerDocumentToDisplay.documentId}`,
                    });
                  }}
                >
                  Serve
                </Button>
              )}

              {documentViewerHelper.showServePetitionButton && (
                <Button
                  link
                  href={`/case-detail/${caseDetail.docketNumber}/petition-qc/document-view/${viewerDocumentToDisplay.documentId}`}
                  icon="paper-plane"
                  iconColor="white"
                >
                  Review and Serve Petition
                </Button>
              )}

              <Button
                link
                icon="file-pdf"
                iconColor="white"
                onClick={() =>
                  openCaseDocumentDownloadUrlSequence({
                    docketNumber: caseDetail.docketNumber,
                    documentId: viewerDocumentToDisplay.documentId,
                  })
                }
              >
                View Full PDF
              </Button>
            </div>
            {!process.env.CI && (
              <iframe
                src={iframeSrc}
                title={documentViewerHelper.description}
              />
            )}
            {showModal == 'ConfirmInitiateCourtIssuedDocumentServiceModal' && (
              <ConfirmInitiateServiceModal
                confirmSequence={serveCourtIssuedDocumentSequence}
                documentTitle={viewerDocumentToDisplay.documentTitle}
              />
            )}
            {showModal == 'ConfirmInitiatePaperDocumentServiceModal' && (
              <ConfirmInitiateServiceModal
                confirmSequence={servePaperFiledDocumentSequence}
                documentTitle={viewerDocumentToDisplay.documentTitle}
              />
            )}
          </>
        )}
      </div>
    );
  },
);
