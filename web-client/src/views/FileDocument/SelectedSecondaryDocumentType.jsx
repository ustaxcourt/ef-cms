import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SelectedSecondaryDocumentType = connect(
  {
    closeDocumentCategoryAccordionSequence:
      sequences.closeDocumentCategoryAccordionSequence,
    editSelectedSecondaryDocumentSequence:
      sequences.editSelectedSecondaryDocumentSequence,
    form: state.form,
  },
  ({
    closeDocumentCategoryAccordionSequence,
    form,
    editSelectedSecondaryDocumentSequence,
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
      </div>
    );
  },
);
