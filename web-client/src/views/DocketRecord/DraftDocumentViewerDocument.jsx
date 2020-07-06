import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
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
    openConfirmEditSignatureModalSequence:
      sequences.openConfirmEditSignatureModalSequence,
    viewerDraftDocumentToDisplay: state.viewerDraftDocumentToDisplay,
  },
  function DraftDocumentViewerDocument({
    archiveDraftDocumentModalSequence,
    caseDetail,
    draftDocumentViewerHelper,
    iframeSrc,
    openCaseDocumentDownloadUrlSequence,
    openConfirmEditModalSequence,
    openConfirmEditSignatureModalSequence,
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
              {draftDocumentViewerHelper.createdByLabel}
            </div>

            <div className="message-document-actions">
              {draftDocumentViewerHelper.showEditButtonNotSigned && (
                <Button
                  link
                  href={`/case-detail/${caseDetail.docketNumber}/edit-order/${viewerDraftDocumentToDisplay.documentId}`}
                  icon="edit"
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
                      docketNumber: caseDetail.docketNumber,
                      documentIdToEdit: viewerDraftDocumentToDisplay.documentId,
                    })
                  }
                >
                  Edit
                </Button>
              )}

              <Button
                link
                icon="trash"
                onClick={() =>
                  archiveDraftDocumentModalSequence({
                    caseId: caseDetail.caseId,
                    documentId: viewerDraftDocumentToDisplay.documentId,
                    documentTitle: viewerDraftDocumentToDisplay.documentTitle,
                    redirectToCaseDetail: true,
                  })
                }
              >
                Delete
              </Button>

              {draftDocumentViewerHelper.showApplySignatureButton && (
                <Button
                  link
                  href={`/case-detail/${caseDetail.docketNumber}/edit-order/${viewerDraftDocumentToDisplay.documentId}/sign/`}
                  icon="pencil-alt"
                >
                  Apply Signature
                </Button>
              )}

              {draftDocumentViewerHelper.showEditSignatureButton && (
                <Button
                  link
                  icon="pencil-alt"
                  onClick={() =>
                    openConfirmEditSignatureModalSequence({
                      documentIdToEdit: viewerDraftDocumentToDisplay.documentId,
                    })
                  }
                >
                  Edit Signature
                </Button>
              )}

              {draftDocumentViewerHelper.showAddDocketEntryButton && (
                <Button
                  link
                  href={`/case-detail/${caseDetail.docketNumber}/documents/${viewerDraftDocumentToDisplay.documentId}/add-court-issued-docket-entry`}
                  icon="plus-circle"
                >
                  Add Docket Entry
                </Button>
              )}

              <Button
                link
                icon="file-pdf"
                iconColor="white"
                onClick={() =>
                  openCaseDocumentDownloadUrlSequence({
                    caseId: caseDetail.caseId,
                    documentId: viewerDraftDocumentToDisplay.documentId,
                  })
                }
              >
                View Full PDF
              </Button>
            </div>
            {!process.env.CI && (
              <iframe
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
