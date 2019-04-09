import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const ChooseDocumentType = connect(
  {
    constants: state.constants,
    form: state.form,
    selectDocumentSequence: sequences.selectDocumentSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateSelectDocumentTypeSequence:
      sequences.validateSelectDocumentTypeSequence,
    validationErrors: state.validationErrors,
  },
  ({
    constants,
    form,
    selectDocumentSequence,
    updateFormValueSequence,
    validateSelectDocumentTypeSequence,
    validationErrors,
  }) => {
    return (
      <div className="blue-container">
        <div
          className={`ustc-form-group ${
            validationErrors.category ? 'usa-input-error' : ''
          }`}
        >
          <label htmlFor="document-category">Document Category</label>
          <select
            name="category"
            id="document-category"
            aria-label="category"
            onChange={e => {
              updateFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
              validateSelectDocumentTypeSequence();
            }}
            value={form.category}
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
              className={`ustc-form-group only-large-screens ${
                validationErrors.documentType ? 'usa-input-error' : ''
              }`}
            >
              <label htmlFor="document-type">Document Type</label>
              <select
                id="document-type"
                name="documentType"
                className="documentType"
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                  validateSelectDocumentTypeSequence();
                }}
                value={form.documentType}
              >
                <option value="">- Select -</option>
                {(constants.CATEGORY_MAP[form.category] || []).map(
                  documentType => (
                    <option
                      key={documentType.documentTitle}
                      value={documentType.documentTitle}
                    >
                      {documentType.documentTitle}
                    </option>
                  ),
                )}
              </select>
              <Text
                className="usa-input-error-message"
                bind="validationErrors.documentType"
              />
            </div>
            <div className="ustc-form-group only-small-screens">
              <fieldset className="usa-fieldset-inputs usa-sans">
                <legend>Document Type</legend>
                <ul className="ustc-vertical-option-list ustc-hide-radio-buttons documentType">
                  {(constants.CATEGORY_MAP[form.category] || []).map(
                    (documentType, index) => (
                      <li
                        key={documentType.documentTitle}
                        value={documentType.documentTitle}
                      >
                        <input
                          id={`documentType-${index}`}
                          type="radio"
                          name="documentType"
                          value={documentType.documentTitle}
                          onClick={e => {
                            updateFormValueSequence({
                              key: e.target.name,
                              value: e.target.value,
                            });
                            selectDocumentSequence();
                          }}
                        />
                        <label htmlFor={`documentType-${index}`}>
                          {documentType.documentTitle}
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
            id="select-document"
            onClick={() => {
              selectDocumentSequence({ doNotProceed: true });
            }}
          >
            Select
          </button>
        </div>
      </div>
    );
  },
);
