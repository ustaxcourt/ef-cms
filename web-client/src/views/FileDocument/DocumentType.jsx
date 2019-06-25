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
      <React.Fragment>
        <div
          className={`usa-form-group ${
            validationErrors.category ? 'usa-form-group--error' : ''
          }`}
        >
          <label className="usa-label" htmlFor="document-category">
            Document Category
          </label>
          <select
            aria-label="category"
            className={`usa-select ${
              validationErrors.category ? 'usa-select--error' : ''
            }`}
            id="document-category"
            name="category"
            value={form.category || ''}
            onChange={e => {
              updateFileDocumentWizardFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
              validateSelectDocumentTypeSequence();
            }}
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
            bind="validationErrors.category"
            className="usa-error-message"
          />
        </div>
        {form.category && (
          <>
            <div
              className={`usa-form-group only-large-screens ${
                validationErrors.documentType ? 'usa-form-group--error' : ''
              }`}
            >
              <label className="usa-label" htmlFor="document-type">
                Document Type
              </label>
              <select
                className={`usa-select documentType ${
                  validationErrors.category ? 'usa-select--error' : ''
                }`}
                id="document-type"
                name="documentType"
                value={form.documentType || ''}
                onChange={e => {
                  updateFileDocumentWizardFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                  validateSelectDocumentTypeSequence();
                }}
              >
                <option value="">- Select -</option>
                {(constants.CATEGORY_MAP[form.category] || []).map(entry => (
                  <option key={entry.eventCode} value={entry.documentType}>
                    {entry.documentType}
                  </option>
                ))}
              </select>
              <Text
                bind="validationErrors.documentType"
                className="usa-error-message"
              />
            </div>
            <div className="usa-form-group only-small-screens">
              <fieldset className="usa-fieldset">
                <legend>Document Type</legend>
                {(constants.CATEGORY_MAP[form.category] || []).map(
                  (entry, index) => (
                    <div
                      className="usa-radio ustc-hide-radio-button"
                      key={entry.documentType}
                    >
                      <input
                        id={`documentType-${index}`}
                        name="documentType"
                        type="radio"
                        value={entry.documentType}
                        onClick={e => {
                          updateFileDocumentWizardFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                          selectDocumentSequence();
                        }}
                      />
                      <label
                        className="usa-label"
                        htmlFor={`documentType-${index}`}
                      >
                        {entry.documentType}
                      </label>
                    </div>
                  ),
                )}
              </fieldset>
            </div>
          </>
        )}
        <div className="only-large-screens">
          <button
            className="usa-button"
            id="select-document"
            type="submit"
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
