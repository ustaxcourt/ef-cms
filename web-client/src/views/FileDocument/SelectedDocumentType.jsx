import { sequences, state } from 'cerebral';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NonstandardForm } from './NonstandardForm';
import React from 'react';
import { connect } from '@cerebral/react';

export const SelectedDocumentType = connect(
  {
    caseDetail: state.caseDetail,
    closeDocumentCategoryAccordionSequence:
      sequences.closeDocumentCategoryAccordionSequence,
    editSelectedDocumentSequence: sequences.editSelectedDocumentSequence,
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
  },
  ({
    caseDetail,
    closeDocumentCategoryAccordionSequence,
    editSelectedDocumentSequence,
    form,
    fileDocumentHelper,
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
          {fileDocumentHelper.primary.showNonstandardForm && (
            <NonstandardForm
              level="primary"
              validationErrors="validationErrors"
            />
          )}
        </div>

        <div className="ustc-form-group">
          <a
            href={`/case-detail/${caseDetail.docketNumber}/file-a-document`}
            className="usa-button"
          >
            Continue
          </a>
        </div>
      </React.Fragment>
    );
  },
);
