import { Button } from '../../ustc-ui/Button/Button';
import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

const getDocumentOption = document => {
  const title = document.documentTitle || document.documentType;
  return (
    <option key={document.documentId} value={`${document.documentId}`}>
      {document.createdAtFormatted} - {title}
    </option>
  );
};

export const CreateCaseMessageModalDialog = connect(
  {
    constants: state.constants,
    createCaseMessageModalHelper: state.createCaseMessageModalHelper,
    form: state.modal.form,
    showChambersSelect: state.modal.showChambersSelect,
    updateCreateCaseMessageAttachmentsSequence:
      sequences.updateCreateCaseMessageAttachmentsSequence,
    updateCreateCaseMessageValueInModalSequence:
      sequences.updateCreateCaseMessageValueInModalSequence,
    updateScreenMetadataSequence: sequences.updateScreenMetadataSequence,
    users: state.users,
    validateCreateCaseMessageInModalSequence:
      sequences.validateCreateCaseMessageInModalSequence,
    validationErrors: state.validationErrors,
    workQueueSectionHelper: state.workQueueSectionHelper,
  },
  function CreateMessageModalDialog({
    constants,
    createCaseMessageModalHelper,
    form,
    onConfirmSequence = 'createCaseMessageSequence',
    showChambersSelect,
    updateCreateCaseMessageAttachmentsSequence,
    updateCreateCaseMessageValueInModalSequence,
    updateScreenMetadataSequence,
    users,
    validateCreateCaseMessageInModalSequence,
    validationErrors,
    workQueueSectionHelper,
  }) {
    validationErrors = validationErrors || {};
    form = form || {};

    return (
      <ConfirmModal
        cancelLabel="Cancel"
        className="ustc-create-message-modal"
        confirmLabel="Send"
        preventCancelOnBlur={true}
        title="Create Message"
        onCancelSequence="clearModalFormSequence"
        onConfirmSequence={onConfirmSequence}
      >
        <FormGroup
          errorText={!showChambersSelect && validationErrors.toSection}
        >
          <label className="usa-label" htmlFor="toSection">
            Select a section
          </label>

          <select
            className="usa-select"
            id="toSection"
            name="toSection"
            onChange={async e => {
              await updateCreateCaseMessageValueInModalSequence({
                key: e.target.name,
                value: e.target.value,
              });
              validateCreateCaseMessageInModalSequence();
            }}
          >
            <option value="">- Select -</option>
            {constants.SECTIONS.map(section => (
              <option key={section} value={section}>
                {workQueueSectionHelper.sectionDisplay(section)}
              </option>
            ))}
          </select>
        </FormGroup>

        {showChambersSelect && (
          <FormGroup
            errorText={validationErrors.toSection && 'Select a chamber'}
          >
            <label className="usa-label" htmlFor="chambers">
              Select chambers
            </label>
            <select
              className="usa-select"
              id="chambers"
              name="chambers"
              onChange={e => {
                updateCreateCaseMessageValueInModalSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
                validateCreateCaseMessageInModalSequence();
              }}
            >
              <option value="">- Select -</option>
              {constants.CHAMBERS_SECTIONS.map(section => (
                <option key={section} value={section}>
                  {workQueueSectionHelper.chambersDisplay(section)}
                </option>
              ))}
            </select>
          </FormGroup>
        )}

        <FormGroup errorText={validationErrors.toUserId}>
          <label className="usa-label" htmlFor="toUserId">
            Select recipient
          </label>
          <select
            aria-disabled={!form.toSection ? 'true' : 'false'}
            className="usa-select"
            disabled={!form.toSection}
            id="toUserId"
            name="toUserId"
            onChange={e => {
              updateCreateCaseMessageValueInModalSequence({
                key: e.target.name,
                value: e.target.value,
              });
              validateCreateCaseMessageInModalSequence();
            }}
          >
            <option value="">- Select -</option>
            {users.map(user => (
              <option key={user.userId} value={user.userId}>
                {user.name}
              </option>
            ))}
          </select>
        </FormGroup>

        <FormGroup errorText={validationErrors.subject}>
          <label className="usa-label" htmlFor="subject">
            Subject line
          </label>
          <input
            className="usa-input"
            id="subject"
            name="subject"
            type="text"
            onChange={e => {
              updateCreateCaseMessageValueInModalSequence({
                key: e.target.name,
                value: e.target.value,
              });
              validateCreateCaseMessageInModalSequence();
            }}
          />
        </FormGroup>

        <FormGroup errorText={validationErrors.message}>
          <label className="usa-label" htmlFor="message">
            Add message
          </label>
          <textarea
            className="usa-textarea"
            id="message"
            name="message"
            onChange={e => {
              updateCreateCaseMessageValueInModalSequence({
                key: e.target.name,
                value: e.target.value,
              });
              validateCreateCaseMessageInModalSequence();
            }}
          />
        </FormGroup>

        {form.attachments && form.attachments.length > 0 && (
          <div className="margin-bottom-20">
            <div>
              <FontAwesomeIcon
                className="fa-icon-black"
                icon="file-pdf"
                size="1x"
              />
              <strong className="margin-left-1">Attachment(s)</strong>
            </div>
            {form.attachments.map((document, idx) => {
              return (
                <div
                  className="margin-top-1"
                  key={`${idx}-${document.documentId}`}
                >
                  {document.documentTitle}
                </div>
              );
            })}
          </div>
        )}

        {createCaseMessageModalHelper.showAddDocumentForm && (
          <FormGroup>
            <label className="usa-label" htmlFor="document">
              Add document(s) <span className="usa-hint">(optional)</span>
            </label>
            <select
              className="usa-select"
              id="document"
              name="document"
              onChange={e => {
                updateCreateCaseMessageAttachmentsSequence({
                  documentId: e.target.value,
                });
                updateScreenMetadataSequence({
                  key: 'showAddDocumentForm',
                  value: false,
                });
                validateCreateCaseMessageInModalSequence();
              }}
            >
              <option value="">- Select -</option>
              {createCaseMessageModalHelper.draftDocuments.length > 0 && (
                <optgroup label="Draft documents">
                  {createCaseMessageModalHelper.draftDocuments.map(
                    getDocumentOption,
                  )}
                </optgroup>
              )}

              {createCaseMessageModalHelper.documents.length > 0 && (
                <optgroup label="Docket record">
                  {createCaseMessageModalHelper.documents.map(
                    getDocumentOption,
                  )}
                </optgroup>
              )}
            </select>
          </FormGroup>
        )}

        {createCaseMessageModalHelper.showAddMoreDocumentsButton && (
          <Button
            link
            icon="plus-circle"
            iconColor="blue"
            onClick={() => {
              updateScreenMetadataSequence({
                key: 'showAddDocumentForm',
                value: true,
              });
            }}
          >
            {' '}
            Add More Document(s)
          </Button>
        )}
      </ConfirmModal>
    );
  },
);
