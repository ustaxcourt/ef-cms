import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NonstandardForm } from './NonstandardForm';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SelectedSecondaryDocumentType = connect(
  {
    closeDocumentCategoryAccordionSequence:
      sequences.closeDocumentCategoryAccordionSequence,
    editSelectedSecondaryDocumentSequence:
      sequences.editSelectedSecondaryDocumentSequence,
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
  },
  ({
    closeDocumentCategoryAccordionSequence,
    form,
    editSelectedSecondaryDocumentSequence,
    fileDocumentHelper,
  }) => {
    return (
      <div className="ustc-form-group">
        <div>
          <label htmlFor="category" className="inline-block mr-1">
            Selected Secondary Document Type
          </label>
          <button
            className="link"
            id="edit-selected-secondary-document-type"
            onClick={() => {
              closeDocumentCategoryAccordionSequence();
              editSelectedSecondaryDocumentSequence();
            }}
          >
            <FontAwesomeIcon icon="edit" size="sm" />
            Edit
          </button>
        </div>
        <div>
          <p>{form.secondaryDocumentType}</p>
        </div>
        {fileDocumentHelper.secondary.showNonstandardForm && (
          <NonstandardForm level="secondary" />
        )}
      </div>
    );
  },
);
