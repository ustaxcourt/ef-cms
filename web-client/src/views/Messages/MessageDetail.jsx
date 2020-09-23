import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { CompleteMessageModalDialog } from './CompleteMessageModalDialog';
import { ConfirmEditModal } from '../DraftDocuments/ConfirmEditModal';
import { ConfirmRemoveSignatureModal } from './ConfirmRemoveSignatureModal';
import { ErrorNotification } from '../ErrorNotification';
import { ForwardMessageModalDialog } from './ForwardMessageModalDialog';
import { MessageDocument } from './MessageDocument';
import { ReplyToMessageModalDialog } from './ReplyToMessageModalDialog';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

const SingleMessage = ({ indent, message }) => (
  <>
    <div className={classNames('grid-row', indent && 'padding-left-5')}>
      <div className="grid-col-2">
        <span className="text-semibold margin-right-1">Received</span>{' '}
        {message.createdAtFormatted}
      </div>
      <div className="grid-col-2">
        <span className="text-semibold margin-right-1">From</span>{' '}
        {message.from}
      </div>
      <div className="grid-col-2">
        <span className="text-semibold margin-right-1">To</span> {message.to}
      </div>
      <div className="grid-col-5">
        <span className="text-semibold margin-right-1">Subject</span>{' '}
        {message.subject}
      </div>
    </div>
    <div
      className={classNames(
        'grid-row margin-top-2',
        indent && 'padding-left-5',
      )}
    >
      <span className="text-semibold margin-right-1">Message</span>{' '}
      {message.message}
    </div>
  </>
);

const CompletedMessage = ({ message }) => (
  <>
    <div className="grid-row">
      <div className="grid-col-2">
        <span className="text-semibold margin-right-1">Completed</span>{' '}
        {message.completedAtFormatted}
      </div>
      <div className="grid-col-3">
        <span className="text-semibold margin-right-1">Completed by</span>{' '}
        {message.completedBy}
      </div>
    </div>
    <div className="grid-row margin-top-2">
      <span className="text-semibold margin-right-1">Comment</span>{' '}
      {message.completedMessage || 'There is no comment'}
    </div>
  </>
);

export const MessageDetail = connect(
  {
    cerebralBindSimpleSetStateSequence:
      sequences.cerebralBindSimpleSetStateSequence,
    formattedMessageDetail: state.formattedMessageDetail,
    isExpanded: state.isExpanded,
    openCompleteMessageModalSequence:
      sequences.openCompleteMessageModalSequence,
    openCreateOrderChooseTypeModalSequence:
      sequences.openCreateOrderChooseTypeModalSequence,
    openForwardMessageModalSequence: sequences.openForwardMessageModalSequence,
    openReplyToMessageModalSequence: sequences.openReplyToMessageModalSequence,
    setMessageDetailViewerDocumentToDisplaySequence:
      sequences.setMessageDetailViewerDocumentToDisplaySequence,
    showModal: state.modal.showModal,
    viewerDocumentToDisplay: state.viewerDocumentToDisplay,
  },
  function MessageDetail({
    cerebralBindSimpleSetStateSequence,
    formattedMessageDetail,
    isExpanded,
    openCompleteMessageModalSequence,
    openCreateOrderChooseTypeModalSequence,
    openForwardMessageModalSequence,
    openReplyToMessageModalSequence,
    setMessageDetailViewerDocumentToDisplaySequence,
    showModal,
    viewerDocumentToDisplay,
  }) {
    return (
      <>
        <CaseDetailHeader />
        <section className="usa-section grid-container message-detail">
          <SuccessNotification />
          <ErrorNotification />
          {formattedMessageDetail.isCompleted && (
            <div
              aria-live="polite"
              className="usa-alert usa-alert--warning"
              role="alert"
            >
              <div className="usa-alert__body">
                Message completed on{' '}
                {formattedMessageDetail.currentMessage.completedAtFormatted} by{' '}
                {formattedMessageDetail.currentMessage.completedBy}
              </div>
            </div>
          )}
          <div className="grid-row grid-gap">
            <div className="grid-col-6">
              <h1 className="margin-bottom-3">Message</h1>
            </div>
            {formattedMessageDetail.showActionButtons && (
              <div className="grid-col-6 display-flex flex-row flex-justify-end">
                <Button
                  link
                  className="action-button"
                  icon="check-circle"
                  id="button-complete"
                  onClick={() => openCompleteMessageModalSequence()}
                >
                  Complete
                </Button>
                <Button
                  link
                  className="action-button margin-left-3"
                  icon="share-square"
                  id="button-forward"
                  onClick={() => openForwardMessageModalSequence()}
                >
                  Forward
                </Button>
                <Button
                  link
                  className="action-button margin-left-3"
                  icon="reply"
                  id="button-reply"
                  onClick={() => openReplyToMessageModalSequence()}
                >
                  Reply
                </Button>
                <Button
                  link
                  className="action-button margin-left-3 margin-right-0"
                  icon="clipboard-list"
                  id="button-create-order"
                  onClick={() =>
                    openCreateOrderChooseTypeModalSequence({
                      parentMessageId:
                        formattedMessageDetail.currentMessage.parentMessageId,
                    })
                  }
                >
                  Create Order
                </Button>
              </div>
            )}
          </div>

          {formattedMessageDetail.hasOlderMessages ? (
            <div className="usa-accordion__heading">
              <button
                aria-expanded={isExpanded}
                className="usa-accordion__button grid-container"
                id="ustc-ui-accordion-item-button-0"
                type="button"
                onClick={() =>
                  cerebralBindSimpleSetStateSequence({
                    key: 'isExpanded',
                    value: !isExpanded,
                  })
                }
              >
                <div className="accordion-item-title padding-left-1">
                  {formattedMessageDetail.isCompleted ? (
                    <CompletedMessage
                      message={formattedMessageDetail.currentMessage}
                    />
                  ) : (
                    <SingleMessage
                      message={formattedMessageDetail.currentMessage}
                    />
                  )}
                </div>
              </button>
            </div>
          ) : (
            <div className="bg-base-lightest padding-top-2 padding-bottom-2 padding-left-3 padding-right-3">
              <SingleMessage message={formattedMessageDetail.currentMessage} />
            </div>
          )}

          {formattedMessageDetail.showOlderMessages &&
            formattedMessageDetail.olderMessages.map((message, idx) => (
              <div
                className="border border-base-lightest padding-top-2 padding-bottom-2 padding-left-3 padding-right-3"
                key={idx}
              >
                <SingleMessage indent={true} message={message} />
              </div>
            ))}

          <h2 className="margin-top-5">Attachments</h2>

          <div className="grid-row grid-gap-5">
            <div className="grid-col-4">
              <div className="border border-base-lighter document-viewer--documents">
                {!formattedMessageDetail.attachments.length && (
                  <div className="padding-2">There are no attachments</div>
                )}

                {formattedMessageDetail.attachments.length > 0 &&
                  formattedMessageDetail.attachments.map((attachment, idx) => {
                    return (
                      <Button
                        className={classNames(
                          'usa-button--unstyled attachment-viewer-button',
                          viewerDocumentToDisplay === attachment && 'active',
                        )}
                        isActive={viewerDocumentToDisplay === attachment}
                        key={idx}
                        onClick={() => {
                          setMessageDetailViewerDocumentToDisplaySequence({
                            viewerDocumentToDisplay: attachment,
                          });
                        }}
                      >
                        <div className="grid-row margin-left-205 line-height-standard">
                          <div
                            className={classNames(
                              'grid-col-8',
                              attachment.archived && 'text-base-dark',
                            )}
                          >
                            {attachment.documentTitle}
                          </div>

                          <div className="grid-col-4 padding-left-105">
                            {attachment.showNotServed && (
                              <span className="text-semibold not-served attachment-information">
                                Not served
                              </span>
                            )}
                            {attachment.archived && (
                              <span className="text-base-dark attachment-information">
                                Deleted
                              </span>
                            )}
                          </div>
                        </div>
                      </Button>
                    );
                  })}
              </div>
            </div>

            <div className="grid-col-8">
              <MessageDocument />
            </div>
          </div>
        </section>
        {showModal === 'CompleteMessageModal' && <CompleteMessageModalDialog />}
        {showModal === 'ForwardMessageModal' && <ForwardMessageModalDialog />}
        {showModal === 'ReplyToMessageModal' && <ReplyToMessageModalDialog />}
        {showModal === 'ConfirmEditModal' && (
          <ConfirmEditModal confirmSequence="navigateToEditOrderSequence" />
        )}
        {showModal === 'ConfirmRemoveSignatureModal' && (
          <ConfirmRemoveSignatureModal confirmSequence="removeSignatureSequence" />
        )}
      </>
    );
  },
);
