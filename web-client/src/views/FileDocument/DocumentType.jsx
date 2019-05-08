import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const DocumentType = connect(
  {
    constants: state.constants,
    form: state.form,
    selectDocumentSequence: sequences.selectDocumentSequence,
    updateFileDocumentWizardFormValueSequence:
      sequences.updateFileDocumentWizardFormValueSequence,
    validateSelectDocumentTypeSequence:
      sequences.validateSelectDocumentTypeSequence,
    validationErrors: state.validationErrors,
  },
  ({
    constants,
    form,
    selectDocumentSequence,
    updateFileDocumentWizardFormValueSequence,
    validateSelectDocumentTypeSequence,
    validationErrors,
  }) => {
    return (
      <div className="blue-container">
        <div
          className={`usa-form-group ${
            validationErrors.category ? 'usa-input-error' : ''
          }`}
        >
          <label className="usa-label" htmlFor="document-category">
            Document Category
          </label>
          <select
            name="category"
            className="usa-select"
            id="document-category"
            aria-label="category"
            onChange={e => {
              updateFileDocumentWizardFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
              validateSelectDocumentTypeSequence();
            }}
            value={form.category || ''}
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
            bind="validationErrors.category"
          />
        </div>
        {form.category && (
          <>
            <div
              className={`usa-form-group only-large-screens ${
                validationErrors.documentType ? 'usa-input-error' : ''
              }`}
            >
              <label className="usa-label" htmlFor="document-type">
                Document Type
              </label>
              <select
                id="document-type"
                name="documentType"
                className="usa-select documentType"
                onChange={e => {
                  updateFileDocumentWizardFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                  validateSelectDocumentTypeSequence();
                }}
                value={form.documentType || ''}
              >
                <option value="">- Select -</option>
                {(constants.CATEGORY_MAP[form.category] || []).map(entry => (
                  <option key={entry.eventCode} value={entry.documentType}>
                    {entry.documentType}
                  </option>
                ))}
              </select>
              <Text
                className="usa-input-error-message"
                bind="validationErrors.documentType"
              />
            </div>
            <div className="usa-form-group only-small-screens">
              <fieldset className="usa-fieldset-inputs usa-sans">
                <legend>Document Type</legend>
                <ul className="ustc-vertical-option-list ustc-hide-radio-buttons documentType">
                  {(constants.CATEGORY_MAP[form.category] || []).map(
                    (entry, index) => (
                      <li key={entry.documentType}>
                        <input
                          id={`documentType-${index}`}
                          type="radio"
                          name="documentType"
                          value={entry.documentType}
                          onClick={e => {
                            updateFileDocumentWizardFormValueSequence({
                              key: e.target.name,
                              value: e.target.value,
                            });
                            selectDocumentSequence();
                          }}
                        />
                        <label htmlFor={`documentType-${index}`}>
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
        <div className="usa-form-group only-large-screens">
          <button
            type="submit"
            className="usa-button"
            id="select-document"
            onClick={() => {
              selectDocumentSequence();
            }}
          >
            Select
          </button>
        </div>
      </div>
    );
  },
);
