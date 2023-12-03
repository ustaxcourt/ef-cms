import { Button } from '../../ustc-ui/Button/Button';
import { PdfViewer } from '../../ustc-ui/PdfPreview/PdfViewer';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const DraftDocumentViewerDocument = connect(
  {
    archiveDraftDocumentModalSequence:
      sequences.archiveDraftDocumentModalSequence,
    caseDetail: state.caseDetail,
    draftDocumentViewerHelper: state.draftDocumentViewerHelper,
    iframeSrc: state.iframeSrc,
    openCaseDocumentDownloadUrlSequence:
      sequences.openCaseDocumentDownloadUrlSequence,
    openConfirmEditModalSequence: sequences.openConfirmEditModalSequence,
    openConfirmRemoveSignatureModalSequence:
      sequences.openConfirmRemoveSignatureModalSequence,
    viewerDraftDocumentToDisplay: state.viewerDraftDocumentToDisplay,
  },
  function DraftDocumentViewerDocument({
    archiveDraftDocumentModalSequence,
    caseDetail,
    draftDocumentViewerHelper,
    iframeSrc,
    openCaseDocumentDownloadUrlSequence,
    openConfirmEditModalSequence,
    openConfirmRemoveSignatureModalSequence,
    viewerDraftDocumentToDisplay,
  }) {
    return (
      <div
        className={classNames(
          'document-viewer--documents',
          !viewerDraftDocumentToDisplay && 'border border-base-lighter',
        )}
      >
        {!viewerDraftDocumentToDisplay && (
          <div className="padding-2">
            There is no document selected for preview
          </div>
        )}
        {viewerDraftDocumentToDisplay && (
          <>
            <h3>{draftDocumentViewerHelper.documentTitle}</h3>

            <div className="grid-row margin-bottom-1">
              <div className="grid-col-6">
                {draftDocumentViewerHelper.createdByLabel}
              </div>

              {draftDocumentViewerHelper.showDocumentNotSignedAlert && (
                <div className="grid-col-6 text-align-right text-secondary-dark text-semibold">
                  Signature required for this document.
                </div>
              )}
            </div>

            <div className="message-document-actions">
              {draftDocumentViewerHelper.showEditButtonNotSigned && (
                <Button
                  link
                  href={viewerDraftDocumentToDisplay.editUrl}
                  icon="edit"
                  id="draft-edit-button-not-signed"
                >
                  Edit
                </Button>
              )}

              {draftDocumentViewerHelper.showEditButtonSigned && (
                <Button
                  link
                  icon="edit"
                  id="edit-order-button"
                  onClick={() =>
                    openConfirmEditModalSequence({
                      docketEntryIdToEdit:
                        viewerDraftDocumentToDisplay.docketEntryId,
                      docketNumber: caseDetail.docketNumber,
                    })
                  }
                >
                  Edit
                </Button>
              )}

              <Button
                link
                icon="trash"
                id="delete-pdf"
                onClick={() =>
                  archiveDraftDocumentModalSequence({
                    docketEntryId: viewerDraftDocumentToDisplay.docketEntryId,
                    docketNumber: caseDetail.docketNumber,
                    documentTitle: viewerDraftDocumentToDisplay.documentTitle,
                  })
                }
              >
                Delete
              </Button>

              {draftDocumentViewerHelper.showApplySignatureButton && (
                <Button
                  link
                  href={draftDocumentViewerHelper.applySignatureLink}
                  icon="pencil-alt"
                  id="apply-signature"
                >
                  Apply Signature
                </Button>
              )}

              {draftDocumentViewerHelper.showRemoveSignatureButton && (
                <Button
                  link
                  icon="pencil-alt"
                  onClick={() =>
                    openConfirmRemoveSignatureModalSequence({
                      docketEntryIdToEdit:
                        viewerDraftDocumentToDisplay.docketEntryId,
                    })
                  }
                >
                  Remove Signature
                </Button>
              )}

              {draftDocumentViewerHelper.showAddDocketEntryButton && (
                <Button
                  link
                  data-testid="add-court-issued-docket-entry-button"
                  href={draftDocumentViewerHelper.addDocketEntryLink}
                  icon="plus-circle"
                  id="add-court-issued-docket-entry-button"
                >
                  Add Docket Entry
                </Button>
              )}

              <Button
                link
                icon="file-pdf"
                iconColor="white"
                id="view-full-pdf"
                onClick={() =>
                  openCaseDocumentDownloadUrlSequence({
                    docketEntryId: viewerDraftDocumentToDisplay.docketEntryId,
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
                title={draftDocumentViewerHelper.documentTitle}
              />
            )}
          </>
        )}
      </div>
    );
  },
);

DraftDocumentViewerDocument.displayName = 'DraftDocumentViewerDocument';
