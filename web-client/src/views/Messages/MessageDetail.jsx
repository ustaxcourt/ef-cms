import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const MessageDetail = connect(
  {
    attachmentDocumentToDisplay: state.attachmentDocumentToDisplay,
    baseUrl: state.baseUrl,
    formattedMessageDetail: state.formattedMessageDetail,
    setAttachmentDocumentToDisplaySequence:
      sequences.setAttachmentDocumentToDisplaySequence,
    token: state.token,
  },
  function MessageDetail({
    attachmentDocumentToDisplay,
    baseUrl,
    formattedMessageDetail,
    setAttachmentDocumentToDisplaySequence,
    token,
  }) {
    return (
      <>
        <CaseDetailHeader />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <h1>Message</h1>

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
                    src={`${baseUrl}/case-documents/${formattedMessageDetail.caseId}/${attachmentDocumentToDisplay.documentId}/document-download-url?token=${token}`}
                    title={attachmentDocumentToDisplay.documentTitle}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      </>
    );
  },
);
