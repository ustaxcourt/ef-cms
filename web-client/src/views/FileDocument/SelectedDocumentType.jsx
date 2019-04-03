import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const SelectedDocumentType = connect(
  {
    closeDocumentCategoryAccordionSequence:
      sequences.closeDocumentCategoryAccordionSequence,
    editSelectedDocumentSequence: sequences.editSelectedDocumentSequence,
    form: state.form,
  },
  ({
    closeDocumentCategoryAccordionSequence,
    editSelectedDocumentSequence,
    form,
  }) => {
    return (
      <React.Fragment>
        <div className="blue-container" role="alert" aria-live="polite">
          <div className="ustc-form-group">
            <div>
              <label htmlFor="category" className="inline-block mr-1">
                Selected Document Type
              </label>
              <button
                className="link"
                id="edit-selected-document-type"
                onClick={() => {
                  closeDocumentCategoryAccordionSequence();
                  editSelectedDocumentSequence();
                }}
              >
                <FontAwesomeIcon icon="edit" size="sm" />
                Edit
              </button>
            </div>
            <div>
              <p>{form.documentType}</p>
            </div>
          </div>
        </div>

        <div className="ustc-form-group">
          <button type="button" className="usa-button" onClick={() => {}}>
            Continue
          </button>
        </div>
      </React.Fragment>
    );
  },
);
