import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const MessageDocument = connect(
  {
    attachmentDocumentToDisplay: state.attachmentDocumentToDisplay,
    caseDetail: state.caseDetail,
    iframeSrc: state.iframeSrc,
    messageDocumentHelper: state.messageDocumentHelper,
    openCaseDocumentDownloadUrlSequence:
      sequences.openCaseDocumentDownloadUrlSequence,
    openConfirmEditModalSequence: sequences.openConfirmEditModalSequence,
    openConfirmEditSignatureModalSequence:
      sequences.openConfirmEditSignatureModalSequence,
    parentMessageId: state.parentMessageId,
  },
  function MessageDocument({
    attachmentDocumentToDisplay,
    caseDetail,
    iframeSrc,
    messageDocumentHelper,
    openCaseDocumentDownloadUrlSequence,
    openConfirmEditModalSequence,
    openConfirmEditSignatureModalSequence,
    parentMessageId,
  }) {
    return (
      <div
        className={classNames(
          'message-detail--attachments',
          !attachmentDocumentToDisplay && 'border border-base-lighter',
        )}
      >
        {!attachmentDocumentToDisplay && (
          <div className="padding-2">There are no attachments to preview</div>
        )}

        {!process.env.CI && attachmentDocumentToDisplay && (
          <>
            <div className="message-document-actions">
              {messageDocumentHelper.showEditButtonNotSigned && (
                <Button
                  link
                  href={`/case-detail/${caseDetail.docketNumber}/edit-order/${attachmentDocumentToDisplay.documentId}/${parentMessageId}`}
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
                      documentIdToEdit: attachmentDocumentToDisplay.documentId,
                      parentMessageId,
                      redirectUrl: `/case-messages/${caseDetail.docketNumber}/message-detail/${parentMessageId}`,
                    })
                  }
                >
                  Edit
                </Button>
              )}

              {messageDocumentHelper.showApplySignatureButton && (
                <Button
                  link
                  href={`/case-detail/${caseDetail.docketNumber}/edit-order/${attachmentDocumentToDisplay.documentId}/sign/${parentMessageId}`}
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
                      documentIdToEdit: attachmentDocumentToDisplay.documentId,
                    })
                  }
                >
                  Edit Signature
                </Button>
              )}

              {messageDocumentHelper.showAddDocketEntryButton && (
                <Button
                  link
                  href={`/case-detail/${caseDetail.docketNumber}/documents/${attachmentDocumentToDisplay.documentId}/add-court-issued-docket-entry/${parentMessageId}`}
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
                    documentId: attachmentDocumentToDisplay.documentId,
                  })
                }
              >
                View Full PDF
              </Button>
            </div>
            <iframe
              src={iframeSrc}
              title={attachmentDocumentToDisplay.documentTitle}
            />
          </>
        )}
      </div>
    );
  },
);
