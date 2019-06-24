import { Focus } from '../../ustc-ui/Focus/Focus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NonstandardForm } from './NonstandardForm';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const DocumentTypeReadOnly = connect(
  {
    closeDocumentCategoryAccordionSequence:
      sequences.closeDocumentCategoryAccordionSequence,
    editSelectedDocumentSequence: sequences.editSelectedDocumentSequence,
    form: state.form,
    selectDocumentTypeHelper: state.selectDocumentTypeHelper,
  },
  ({
    closeDocumentCategoryAccordionSequence,
    editSelectedDocumentSequence,
    form,
    selectDocumentTypeHelper,
  }) => {
    return (
      <div className="document-type-read-only">
        <div aria-live="polite" role="alert">
          <div
            className={`usa-form-group ${
              !selectDocumentTypeHelper.primary.showNonstandardForm
                ? 'margin-bottom-0'
                : ''
            }`}
          >
            <div>
              <Focus className="header-with-link-button">
                <label className="focusable" htmlFor="category" tabIndex="-1">
                  Selected Document Type
                </label>
              </Focus>
              <button
                className="usa-button usa-button--unstyled"
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
              <p className="margin-top-105 margin-bottom-0">
                {form.documentType}
              </p>
            </div>
          </div>
          {selectDocumentTypeHelper.primary.showNonstandardForm && (
            <NonstandardForm
              helper="selectDocumentTypeHelper"
              level="primary"
              updateSequence="updateFileDocumentWizardFormValueSequence"
              validateSequence="validateSelectDocumentTypeSequence"
              validationErrors="validationErrors"
            />
          )}
        </div>
      </div>
    );
  },
);
