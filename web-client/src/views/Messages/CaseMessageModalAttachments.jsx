import { Button } from '../../ustc-ui/Button/Button';
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

export const CaseMessageModalAttachments = connect(
  {
    caseMessageModalHelper: state.caseMessageModalHelper,
    form: state.modal.form,
    updateCaseMessageModalAttachmentsSequence:
      sequences.updateCaseMessageModalAttachmentsSequence,
    updateScreenMetadataSequence: sequences.updateScreenMetadataSequence,
    validateCreateCaseMessageInModalSequence:
      sequences.validateCreateCaseMessageInModalSequence,
  },
  function CaseMessageModalAttachments({
    caseMessageModalHelper,
    form,
    updateCaseMessageModalAttachmentsSequence,
    updateScreenMetadataSequence,
    validateCreateCaseMessageInModalSequence,
  }) {
    return (
      <>
        {caseMessageModalHelper.showMessageAttachments && (
          <div className="margin-bottom-20">
            <div>
              <FontAwesomeIcon
                className="fa-icon-black"
                icon="file-pdf"
                size="1x"
              />
              <span className="margin-left-1 semi-bold">Attachment(s)</span>
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

        {caseMessageModalHelper.showAddDocumentForm && (
          <FormGroup>
            <label className="usa-label" htmlFor="document">
              Add document(s) <span className="usa-hint">(optional)</span>
            </label>
            <select
              className="usa-select"
              id="document"
              name="document"
              onChange={e => {
                updateCaseMessageModalAttachmentsSequence({
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
              {caseMessageModalHelper.hasDraftDocuments && (
                <optgroup label="Draft documents">
                  {caseMessageModalHelper.draftDocuments.map(getDocumentOption)}
                </optgroup>
              )}

              {caseMessageModalHelper.hasDocuments && (
                <optgroup label="Docket record">
                  {caseMessageModalHelper.documents.map(getDocumentOption)}
                </optgroup>
              )}

              {caseMessageModalHelper.hasCorrespondence && (
                <optgroup label="Correspondence">
                  {caseMessageModalHelper.correspondence.map(getDocumentOption)}
                </optgroup>
              )}
            </select>
          </FormGroup>
        )}

        {caseMessageModalHelper.showAddMoreDocumentsButton && (
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
