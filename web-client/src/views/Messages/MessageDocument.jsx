import { Button } from '../../ustc-ui/Button/Button';
import { ConfirmInitiateServiceModal } from '../ConfirmInitiateServiceModal';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const MessageDocument = connect(
  {
    caseDetail: state.caseDetail,
    iframeSrc: state.iframeSrc,
    messageDocumentHelper: state.messageDocumentHelper,
    openCaseDocumentDownloadUrlSequence:
      sequences.openCaseDocumentDownloadUrlSequence,
    openConfirmEditModalSequence: sequences.openConfirmEditModalSequence,
    openConfirmEditSignatureModalSequence:
      sequences.openConfirmEditSignatureModalSequence,
    openConfirmServeCourtIssuedDocumentSequence:
      sequences.openConfirmServeCourtIssuedDocumentSequence,
    openConfirmServePaperFiledDocumentSequence:
      sequences.openConfirmServePaperFiledDocumentSequence,
    parentMessageId: state.parentMessageId,
    serveCourtIssuedDocumentSequence:
      sequences.serveCourtIssuedDocumentSequence,
    servePaperFiledDocumentSequence: sequences.servePaperFiledDocumentSequence,
    showModal: state.modal.showModal,
    viewerDocumentToDisplay: state.viewerDocumentToDisplay,
  },
  function MessageDocument({
    caseDetail,
    iframeSrc,
    messageDocumentHelper,
    openCaseDocumentDownloadUrlSequence,
    openConfirmEditModalSequence,
    openConfirmEditSignatureModalSequence,
    openConfirmServeCourtIssuedDocumentSequence,
    openConfirmServePaperFiledDocumentSequence,
    parentMessageId,
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
          <div className="padding-2">There are no attachments to preview</div>
        )}

        {messageDocumentHelper.showDocumentNotSignedAlert && (
          <div className="text-align-right text-secondary-dark text-semibold margin-bottom-1">
            Signature required for this document.
          </div>
        )}

        {viewerDocumentToDisplay && (
          <>
            <div className="message-document-actions">
              {messageDocumentHelper.showEditButtonNotSigned && (
                <Button
                  link
                  href={`/case-detail/${caseDetail.docketNumber}/edit-order/${viewerDocumentToDisplay.documentId}/${parentMessageId}`}
                  icon="edit"
                >
                  Edit
                </Button>
              )}

              {messageDocumentHelper.showEditButtonSigned && (
                <Button
                  link
                  icon="edit"
                  onClick={() =>
                    openConfirmEditModalSequence({
                      docketNumber: caseDetail.docketNumber,
                      documentIdToEdit: viewerDocumentToDisplay.documentId,
                      parentMessageId,
                      redirectUrl: `/case-messages/${caseDetail.docketNumber}/message-detail/${parentMessageId}`,
                    })
                  }
                >
                  Edit
                </Button>
              )}

              {messageDocumentHelper.showEditCorrespondenceButton && (
                <Button
                  link
                  href={`/case-detail/${caseDetail.docketNumber}/edit-correspondence/${viewerDocumentToDisplay.documentId}/${parentMessageId}`}
                  icon="edit"
                >
                  Edit
                </Button>
              )}

              {messageDocumentHelper.showApplySignatureButton && (
                <Button
                  link
                  href={`/case-detail/${caseDetail.docketNumber}/edit-order/${viewerDocumentToDisplay.documentId}/sign/${parentMessageId}`}
                  icon="pencil-alt"
                >
                  Apply Signature
                </Button>
              )}

              {messageDocumentHelper.showEditSignatureButton && (
                <Button
                  link
                  icon="pencil-alt"
                  onClick={() =>
                    openConfirmEditSignatureModalSequence({
                      documentIdToEdit: viewerDocumentToDisplay.documentId,
                    })
                  }
                >
                  Edit Signature
                </Button>
              )}

              {messageDocumentHelper.showAddDocketEntryButton && (
                <Button
                  link
                  href={`/case-detail/${caseDetail.docketNumber}/documents/${viewerDocumentToDisplay.documentId}/add-court-issued-docket-entry/${parentMessageId}`}
                  icon="plus-circle"
                >
                  Add Docket Entry
                </Button>
              )}

              {messageDocumentHelper.showServeCourtIssuedDocumentButton && (
                <Button
                  link
                  icon="paper-plane"
                  iconColor="white"
                  onClick={() => {
                    openConfirmServeCourtIssuedDocumentSequence({
                      documentId: viewerDocumentToDisplay.documentId,
                      redirectUrl: `/case-messages/${caseDetail.docketNumber}/message-detail/${parentMessageId}`,
                    });
                  }}
                >
                  Serve
                </Button>
              )}

              {messageDocumentHelper.showServePaperFiledDocumentButton && (
                <Button
                  link
                  icon="paper-plane"
                  iconColor="white"
                  onClick={() => {
                    openConfirmServePaperFiledDocumentSequence({
                      documentId: viewerDocumentToDisplay.documentId,
                      redirectUrl: `/case-messages/${caseDetail.docketNumber}/message-detail/${parentMessageId}`,
                    });
                  }}
                >
                  Serve
                </Button>
              )}

              {messageDocumentHelper.showServePetitionButton && (
                <Button
                  link
                  href={`/case-detail/${caseDetail.docketNumber}/petition-qc/${parentMessageId}`}
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
                    caseId: caseDetail.caseId,
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
                title={viewerDocumentToDisplay.documentTitle}
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
