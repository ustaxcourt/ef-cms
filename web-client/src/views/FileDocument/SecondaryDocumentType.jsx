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
    form,
    selectDocumentSequence,
    selectDocumentTypeHelper,
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
          <label className="usa-label" htmlFor="document-secondary-category">
            Document Category
          </label>
          <select
            aria-label="secondaryCategory"
            className="usa-select"
            id="document-secondary-category"
            name="secondaryDocument.category"
            value={form.secondaryDocument.category || ''}
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
            bind="validationErrors.secondaryDocument.category"
            className="usa-error-message"
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
                className="usa-label"
                htmlFor="secondary-doc-secondary-document-type"
              >
                Document Type
              </label>
              <select
                className="secondaryDocumentType usa-select"
                id="secondary-doc-secondary-document-type"
                name="secondaryDocument.documentType"
                value={form.secondaryDocument.documentType || ''}
                onChange={e => {
                  updateFileDocumentWizardFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                  validateSelectDocumentTypeSequence();
                }}
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
                bind="validationErrors.secondaryDocument.documentType"
                className="usa-error-message"
              />
            </div>
            <div className="usa-form-group only-small-screens">
              <fieldset className="usa-fieldset">
                <legend>Document Type</legend>
                {selectDocumentTypeHelper.filteredSecondaryDocumentTypes.map(
                  (entry, index) => (
                    <div
                      className="usa-radio ustc-hide-radio-button"
                      key={entry.documentType}
                    >
                      <input
                        id={`secondaryDocumentType-${index}`}
                        name="secondaryDocument.documentType"
                        type="radio"
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
                        className="usa-label"
                        htmlFor={`secondaryDocumentType-${index}`}
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
            id="select-secondary-document"
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
