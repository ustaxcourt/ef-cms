import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { CompleteCaseMessageModalDialog } from './CompleteCaseMessageModalDialog';
import { ErrorNotification } from '../ErrorNotification';
import { ForwardCaseMessageModalDialog } from './ForwardCaseMessageModalDialog';
import { ReplyToCaseMessageModalDialog } from './ReplyToCaseMessageModalDialog';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const MessageDetail = connect(
  {
    attachmentDocumentToDisplay: state.attachmentDocumentToDisplay,
    formattedMessageDetail: state.formattedMessageDetail,
    iframeSrc: state.iframeSrc,
    openCompleteMessageModalSequence:
      sequences.openCompleteMessageModalSequence,
    openForwardMessageModalSequence: sequences.openForwardMessageModalSequence,
    openReplyToMessageModalSequence: sequences.openReplyToMessageModalSequence,
    setAttachmentDocumentToDisplaySequence:
      sequences.setAttachmentDocumentToDisplaySequence,
    showModal: state.modal.showModal,
  },
  function MessageDetail({
    attachmentDocumentToDisplay,
    formattedMessageDetail,
    iframeSrc,
    openCompleteMessageModalSequence,
    openForwardMessageModalSequence,
    openReplyToMessageModalSequence,
    setAttachmentDocumentToDisplaySequence,
    showModal,
  }) {
    return (
      <>
        <CaseDetailHeader />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <div className="grid-row grid-gap">
            <div className="grid-col-8">
              <h1>Message</h1>
            </div>
            <div className="grid-col-1">
              <Button
                link
                className="action-button"
                icon="check-circle"
                onClick={() => openCompleteMessageModalSequence()}
              >
                Complete
              </Button>
            </div>
            <div className="grid-col-1">
              <Button
                link
                className="action-button"
                icon="share-square"
                onClick={() => openForwardMessageModalSequence()}
              >
                Forward
              </Button>
            </div>
            <div className="grid-col-1">
              <Button
                link
                className="action-button"
                icon="reply"
                onClick={() => openReplyToMessageModalSequence()}
              >
                Reply
              </Button>
            </div>
          </div>

          <div className="bg-base-lightest padding-top-2 padding-bottom-2 padding-left-3 padding-right-3">
            <div className="grid-row">
              <div className="grid-col-2">
                <span className="text-semibold margin-right-1">Received</span>{' '}
                {formattedMessageDetail.createdAtFormatted}
              </div>
              <div className="grid-col-2">
                <span className="text-semibold margin-right-1">From</span>{' '}
                {formattedMessageDetail.from}
              </div>
              <div className="grid-col-2">
                <span className="text-semibold margin-right-1">To</span>{' '}
                {formattedMessageDetail.to}
              </div>
              <div className="grid-col-6">
                <span className="text-semibold margin-right-1">Subject</span>{' '}
                {formattedMessageDetail.subject}
              </div>
            </div>
            <div className="grid-row margin-top-2">
              <span className="text-semibold margin-right-1">Message</span>{' '}
              {formattedMessageDetail.message}
            </div>
          </div>

          <h2 className="margin-top-5">Attachments</h2>

          <div className="grid-row grid-gap-5">
            <div className="grid-col-4">
              <div className="border border-base-lighter message-detail--attachments">
                {!formattedMessageDetail.attachments.length && (
                  <span className="padding-2">There are no attachments</span>
                )}

                {formattedMessageDetail.attachments.length > 0 &&
                  formattedMessageDetail.attachments.map(attachment => {
                    const active =
                      attachmentDocumentToDisplay === attachment
                        ? 'active'
                        : '';
                    return (
                      <Button
                        className={`usa-button--unstyled attachment-viewer-button ${active}`}
                        key={attachment.documentId}
                        onClick={() => {
                          setAttachmentDocumentToDisplaySequence({
                            attachmentDocumentToDisplay: attachment,
                          });
                        }}
                      >
                        {attachment.documentTitle}
                      </Button>
                    );
                  })}
              </div>
            </div>

            <div className="grid-col-8">
              <div className="border border-base-lighter message-detail--attachments">
                {!attachmentDocumentToDisplay && (
                  <span className="padding-2">
                    There are no attachments to preview
                  </span>
                )}

                {!process.env.CI && attachmentDocumentToDisplay && (
                  <iframe
                    src={iframeSrc}
                    title={attachmentDocumentToDisplay.documentTitle}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
        {showModal === 'CompleteMessageModal' && (
          <CompleteCaseMessageModalDialog />
        )}
        {showModal === 'ForwardMessageModal' && (
          <ForwardCaseMessageModalDialog />
        )}
        {showModal === 'ReplyToMessageModal' && (
          <ReplyToCaseMessageModalDialog />
        )}
      </>
    );
  },
);
