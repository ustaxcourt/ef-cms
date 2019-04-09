import { sequences, state } from 'cerebral';

import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import React from 'react';

export const ChooseSecondaryDocumentType = connect(
  {
    clearWizardDataSequence: sequences.clearWizardDataSequence,
    constants: state.constants,
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
    selectDocumentSequence: sequences.selectDocumentSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateSelectDocumentTypeSequence:
      sequences.validateSelectDocumentTypeSequence,
    validationErrors: state.validationErrors,
  },
  ({
    clearWizardDataSequence,
    constants,
    fileDocumentHelper,
    form,
    selectDocumentSequence,
    updateFormValueSequence,
    validateSelectDocumentTypeSequence,
    validationErrors,
  }) => {
    return (
      <React.Fragment>
        <h4>Which Document Are You Requesting Leave to File For?</h4>
        <div
          className={`ustc-form-group ${
            validationErrors.secondaryDocument &&
            validationErrors.secondaryDocument.category
              ? 'usa-input-error'
              : ''
          }`}
        >
          <label htmlFor="document-secondary-category">Document Category</label>
          <select
            name="secondaryDocument.category"
            id="document-secondary-category"
            aria-label="secondaryCategory"
            onChange={e => {
              updateFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
              clearWizardDataSequence({
                key: e.target.name,
              });
              validateSelectDocumentTypeSequence();
            }}
            value={form.secondaryDocument.category}
          >
            <option value="">- Select -</option>
            {constants.CATEGORIES.map(category => {
              return (
                <option key={category} value={category}>
                  {category}
                </option>
              );
            })}
          </select>
          <Text
            className="usa-input-error-message"
            bind="validationErrors.secondaryDocument.category"
          />
        </div>
        {form.secondaryDocument && (
          <>
            <div
              className={`ustc-form-group only-large-screens ${
                validationErrors.secondaryDocument &&
                validationErrors.secondaryDocument.documentType
                  ? 'usa-input-error'
                  : ''
              }`}
            >
              <label htmlFor="secondary-document-type">Document Type</label>
              <select
                id="secondary-document-type"
                name="secondaryDocument.documentType"
                className="secondaryDocumentType"
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                  clearWizardDataSequence({
                    key: e.target.name,
                  });
                  validateSelectDocumentTypeSequence();
                }}
                value={form.secondaryDocument.documentType}
              >
                <option value="">- Select -</option>
                {fileDocumentHelper.filteredSecondaryDocumentTypes.map(
                  entry => (
                    <option key={entry.documentType} value={entry.documentType}>
                      {entry.documentType}
                    </option>
                  ),
                )}
              </select>
              <Text
                className="usa-input-error-message"
                bind="validationErrors.secondaryDocument.documentType"
              />
            </div>
            <div className="ustc-form-group only-small-screens">
              <fieldset className="usa-fieldset-inputs usa-sans">
                <legend>Document Type</legend>
                <ul className="ustc-vertical-option-list ustc-hide-radio-buttons secondaryDocumentType">
                  {fileDocumentHelper.filteredSecondaryDocumentTypes.map(
                    (entry, index) => (
                      <li key={entry.documentType} value={entry.documentType}>
                        <input
                          id={`secondaryDocumentType-${index}`}
                          type="radio"
                          name="secondaryDocumentType"
                          value={entry.documentType}
                          onClick={e => {
                            updateFormValueSequence({
                              key: e.target.name,
                              value: e.target.value,
                            });
                            clearWizardDataSequence({
                              key: e.target.name,
                            });
                            selectDocumentSequence();
                          }}
                        />
                        <label htmlFor={`secondaryDocumentType-${index}`}>
                          {entry.documentType}
                        </label>
                      </li>
                    ),
                  )}
                </ul>
              </fieldset>
            </div>
          </>
        )}
        <div className="ustc-form-group only-large-screens">
          <button
            type="submit"
            className="usa-button"
            id="select-secondary-document"
            onClick={() => {
              selectDocumentSequence();
            }}
          >
            Select
          </button>
        </div>
      </React.Fragment>
    );
  },
);
