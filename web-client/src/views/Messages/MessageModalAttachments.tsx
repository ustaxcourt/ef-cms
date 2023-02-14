import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

const getDocumentOption = doc => {
  const documentTitle = doc.title.substr(0, 100);

  return (
    <option key={doc.docketEntryId} value={`${doc.docketEntryId}`}>
      {doc.createdAtFormatted} - {documentTitle}
    </option>
  );
};

const getCorrespondenceOption = doc => {
  const title = doc.documentTitle || doc.documentType;
  const documentTitle = title.substr(0, 100);
  return (
    <option key={doc.correspondenceId} value={`${doc.correspondenceId}`}>
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
              <span className="margin-left-1 semi-bold">Attachment(s)</span>
            </div>
            {form.attachments.map(doc => {
              return (
                <div className="margin-top-1" key={doc.documentId}>
                  {doc.documentTitle}
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
              id="document"
              name="document"
              onChange={e => {
                updateMessageModalAttachmentsSequence({
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
