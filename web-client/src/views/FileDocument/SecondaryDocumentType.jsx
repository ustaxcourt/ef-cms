import { Focus } from '../../ustc-ui/Focus/Focus';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SecondaryDocumentType = connect(
  {
    constants: state.constants,
    form: state.form,
    selectDocumentSequence: sequences.selectDocumentSequence,
    selectDocumentTypeHelper: state.selectDocumentTypeHelper,
    updateFileDocumentWizardFormValueSequence:
      sequences.updateFileDocumentWizardFormValueSequence,
    validateSelectDocumentTypeSequence:
      sequences.validateSelectDocumentTypeSequence,
    validationErrors: state.validationErrors,
  },
  ({
    constants,
    selectDocumentTypeHelper,
    form,
    selectDocumentSequence,
    updateFileDocumentWizardFormValueSequence,
    validateSelectDocumentTypeSequence,
    validationErrors,
  }) => {
    return (
      <React.Fragment>
        <Focus>
          <h4 className="focusable" tabIndex="-1">
            Which Document Are You Requesting Leave to File For?
          </h4>
        </Focus>
        <div
          className={`usa-form-group ${
            validationErrors.secondaryDocument &&
            validationErrors.secondaryDocument.category
              ? 'usa-form-group--error'
              : ''
          }`}
        >
          <label htmlFor="document-secondary-category" className="usa-label">
            Document Category
          </label>
          <select
            name="secondaryDocument.category"
            id="document-secondary-category"
            aria-label="secondaryCategory"
            className="usa-select"
            onChange={e => {
              updateFileDocumentWizardFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
              validateSelectDocumentTypeSequence();
            }}
            value={form.secondaryDocument.category || ''}
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
            className="usa-error-message"
            bind="validationErrors.secondaryDocument.category"
          />
        </div>
        {form.secondaryDocument && (
          <>
            <div
              className={`usa-form-group only-large-screens ${
                validationErrors.secondaryDocument &&
                validationErrors.secondaryDocument.documentType
                  ? 'usa-form-group--error'
                  : ''
              }`}
            >
              <label
                htmlFor="secondary-doc-secondary-document-type"
                className="usa-label"
              >
                Document Type
              </label>
              <select
                id="secondary-doc-secondary-document-type"
                name="secondaryDocument.documentType"
                className="secondaryDocumentType usa-select"
                onChange={e => {
                  updateFileDocumentWizardFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                  validateSelectDocumentTypeSequence();
                }}
                value={form.secondaryDocument.documentType || ''}
              >
                <option value="">- Select -</option>
                {selectDocumentTypeHelper.filteredSecondaryDocumentTypes.map(
                  entry => (
                    <option key={entry.eventCode} value={entry.documentType}>
                      {entry.documentType}
                    </option>
                  ),
                )}
              </select>
              <Text
                className="usa-error-message"
                bind="validationErrors.secondaryDocument.documentType"
              />
            </div>
            <div className="usa-form-group only-small-screens">
              <fieldset className="usa-fieldset">
                <legend>Document Type</legend>
                {selectDocumentTypeHelper.filteredSecondaryDocumentTypes.map(
                  (entry, index) => (
                    <div
                      key={entry.documentType}
                      className="usa-radio ustc-hide-radio-button"
                    >
                      <input
                        id={`secondaryDocumentType-${index}`}
                        type="radio"
                        name="secondaryDocument.documentType"
                        value={entry.documentType || ''}
                        onClick={e => {
                          updateFileDocumentWizardFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                          selectDocumentSequence();
                        }}
                      />
                      <label
                        htmlFor={`secondaryDocumentType-${index}`}
                        className="usa-label"
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
        <div className="usa-form-group only-large-screens">
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
