import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const ChooseSecondaryDocumentType = connect(
  {
    constants: state.constants,
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
    selectSecondaryDocumentSequence: sequences.selectSecondaryDocumentSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state.validationErrors,
  },
  ({
    constants,
    fileDocumentHelper,
    form,
    selectSecondaryDocumentSequence,
    updateFormValueSequence,
    validationErrors,
  }) => {
    return (
      <React.Fragment>
        <h4>Which Document Are You Requesting Leave to File For?</h4>
        <div
          className={`ustc-form-group ${
            validationErrors.secondaryCategory ? 'usa-input-error' : ''
          }`}
        >
          <label htmlFor="document-secondary-category">Document Category</label>
          <select
            name="secondaryCategory"
            id="document-secondary-category"
            aria-label="secondaryCategory"
            onChange={e => {
              updateFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
            value={form.secondaryCategory}
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
            bind="validationErrors.secondaryCategory"
          />
        </div>
        {form.secondaryCategory && (
          <>
            <div
              className={`ustc-form-group only-large-screens ${
                validationErrors.secondaryDocumentType ? 'usa-input-error' : ''
              }`}
            >
              <label htmlFor="secondary-document-type">Document Type</label>
              <select
                id="secondary-document-type"
                name="secondaryDocumentType"
                className="secondaryDocumentType"
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
                value={form.secondaryDocumentType}
              >
                <option value="">- Select -</option>
                {fileDocumentHelper.filteredSecondaryDocumentTypes.map(
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
                bind="validationErrors.secondaryDocumentType"
              />
            </div>
            <div className="ustc-form-group only-small-screens">
              <fieldset className="usa-fieldset-inputs usa-sans">
                <legend>Document Type</legend>
                <ul className="ustc-vertical-option-list ustc-hide-radio-buttons secondaryDocumentType">
                  {fileDocumentHelper.filteredSecondaryDocumentTypes.map(
                    (documentType, index) => (
                      <li
                        key={documentType.documentTitle}
                        value={documentType.documentTitle}
                      >
                        <input
                          id={`secondaryDocumentType-${index}`}
                          type="radio"
                          name="secondaryDocumentType"
                          value={documentType.documentTitle}
                          onClick={e => {
                            updateFormValueSequence({
                              key: e.target.name,
                              value: e.target.value,
                            });
                            selectSecondaryDocumentSequence();
                          }}
                        />
                        <label htmlFor={`secondaryDocumentType-${index}`}>
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
            id="select-secondary-document"
            onClick={() => {
              selectSecondaryDocumentSequence();
            }}
          >
            Select
          </button>
        </div>
      </React.Fragment>
    );
  },
);
