import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

const getDocumentOption = doc => {
  const documentTitle = doc.title.substr(0, 100);

  return (
    <option
      disabled={doc.isAlreadyAttached}
      key={doc.docketEntryId}
      value={`${doc.docketEntryId}`}
    >
      {doc.index != null ? `${doc.index} - ` : ''}
      {doc.createdAtFormatted} - {documentTitle}
    </option>
  );
};

const getCorrespondenceOption = doc => {
  const title = doc.documentTitle || doc.documentType;
  const documentTitle = title.substr(0, 100);
  return (
    <option
      disabled={doc.isAlreadyAttached}
      key={doc.correspondenceId}
      value={`${doc.correspondenceId}`}
    >
      {documentTitle}
    </option>
  );
};

export const MessageModalAttachments = connect(
  {
    form: state.modal.form,
    messageModalHelper: state.messageModalHelper,
    updateMessageModalAttachmentsSequence:
      sequences.updateMessageModalAttachmentsSequence,
    updateScreenMetadataSequence: sequences.updateScreenMetadataSequence,
    validateCreateMessageInModalSequence:
      sequences.validateCreateMessageInModalSequence,
  },
  function MessageModalAttachments({
    form,
    messageModalHelper,
    updateMessageModalAttachmentsSequence,
    updateScreenMetadataSequence,
    validateCreateMessageInModalSequence,
  }) {
    return (
      <>
        {messageModalHelper.showMessageAttachments && (
          <div className="margin-bottom-20">
            <div>
              <FontAwesomeIcon
                className="fa-icon-black"
                icon="file-pdf"
                size="1x"
              />
              <span className="margin-left-1 semi-bold">*Attachment(s)</span>
            </div>
            {form.attachments.map(doc => {
              return (
                <div className="margin-top-1" key={doc.documentId}>
                  <div className="grid-row">
                    <div className="grid-col-9">{doc.documentTitle}</div>
                  </div>
                </div>
              );
            })}
            {form.draftAttachments.map(doc1 => {
              // Find the matching doc2 by comparing documentId and docketEntryId
              const doc2 = messageModalHelper.documents.find(
                doc => doc.docketEntryId === doc1.documentId,
              );

              return (
                <div className="margin-top-1" key={doc1.documentId}>
                  <div className="grid-row">
                    <div className="grid-col-10">
                      {/* If a matching doc2 is found, use doc2.docketEntryId, otherwise leave it blank */}
                      {doc2 ? doc2.index : ''} - {doc1.documentTitle}
                    </div>
                    <div className="grid-col-2">
                      <Button
                        link
                        className="modal-button-link no-underline"
                        icon="times-circle"
                        iconColor="blue"
                        iconRight
                        onClick={() => {
                          updateMessageModalAttachmentsSequence({
                            action: 'remove',
                            documentId: doc1.documentId,
                          });
                        }}
                        style={{
                          textDecoration: 'none', // Remove underline from button
                        }}
                      >
                        <span
                          className="close-text"
                          style={{
                            display: 'inline-block', // Ensure it's treated as an inline element for hover effect
                          }}
                          onMouseEnter={e =>
                            ((e.target as HTMLElement).style.textDecoration =
                              'underline')
                          } // Cast to HTMLElement for style
                          onMouseLeave={e =>
                            ((e.target as HTMLElement).style.textDecoration =
                              'none')
                          } // Cast to HTMLElement for style
                        >
                          Close
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {messageModalHelper.showAddDocumentForm && (
          <FormGroup>
            <label className="usa-label" htmlFor="document">
              Add document(s) <span className="usa-hint">(optional)</span>
            </label>
            <select
              className="usa-select"
              data-testid="select-document"
              id="document"
              name="document"
              onChange={e => {
                updateMessageModalAttachmentsSequence({
                  action: 'add',
                  documentId: e.target.value,
                });
                updateScreenMetadataSequence({
                  key: 'showAddDocumentForm',
                  value: false,
                });
                validateCreateMessageInModalSequence();
              }}
            >
              <option value="">- Select -</option>
              {messageModalHelper.hasDraftDocuments && (
                <optgroup label="Draft documents">
                  {messageModalHelper.draftDocuments.map(getDocumentOption)}
                </optgroup>
              )}

              {messageModalHelper.hasDocuments && (
                <optgroup label="Docket record">
                  {messageModalHelper.documents.map(getDocumentOption)}
                </optgroup>
              )}

              {messageModalHelper.hasCorrespondence && (
                <optgroup label="Correspondence">
                  {messageModalHelper.correspondence.map(
                    getCorrespondenceOption,
                  )}
                </optgroup>
              )}
            </select>
          </FormGroup>
        )}

        {messageModalHelper.showAddMoreDocumentsButton && (
          <Button
            link
            className="modal-button-link"
            icon="plus-circle"
            iconColor="blue"
            onClick={() => {
              updateScreenMetadataSequence({
                key: 'showAddDocumentForm',
                value: true,
              });
            }}
          >
            Add More Document(s)
          </Button>
        )}
      </>
    );
  },
);

MessageModalAttachments.displayName = 'MessageModalAttachments';
