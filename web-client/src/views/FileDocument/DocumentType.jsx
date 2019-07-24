import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import Select from 'react-select';

export const DocumentType = connect(
  {
    constants: state.constants,
    form: state.form,
    selectDocumentSelectHelper: state.selectDocumentSelectHelper,
    selectDocumentSequence: sequences.selectDocumentSequence,
    updateFileDocumentWizardFormValueSequence:
      sequences.updateFileDocumentWizardFormValueSequence,
    updateScreenMetadataSequence: sequences.updateScreenMetadataSequence,
    validateSelectDocumentTypeSequence:
      sequences.validateSelectDocumentTypeSequence,
    validationErrors: state.validationErrors,
  },
  ({
    constants,
    form,
    selectDocumentSelectHelper,
    selectDocumentSequence,
    updateFileDocumentWizardFormValueSequence,
    updateScreenMetadataSequence,
    validateSelectDocumentTypeSequence,
    validationErrors,
  }) => {
    return (
      <React.Fragment>
        <NonMobile>
          <div
            className={`usa-form-group ${
              validationErrors.documentType ? 'usa-form-group--error' : ''
            }`}
          >
            <label className="usa-label" htmlFor="document-type">
              Document Type
            </label>{' '}
            <Select
              aria-describedby="document-type-label"
              className="select-react-element"
              classNamePrefix="select-react-element"
              id="document-type"
              isClearable={true}
              name="eventCode"
              options={selectDocumentSelectHelper.documentTypesForSelectSorted}
              placeholder="- Select -"
              onChange={(inputValue, { action }) => {
                switch (action) {
                  case 'select-option':
                    updateFileDocumentWizardFormValueSequence({
                      key: 'category',
                      value: inputValue.category,
                    });
                    updateFileDocumentWizardFormValueSequence({
                      key: 'documentType',
                      value: inputValue.documentType,
                    });
                    updateFileDocumentWizardFormValueSequence({
                      key: 'eventCode',
                      value: inputValue.eventCode,
                    });
                    validateSelectDocumentTypeSequence();
                    break;
                  case 'clear':
                    updateFileDocumentWizardFormValueSequence({
                      key: 'category',
                      value: '',
                    });
                    validateSelectDocumentTypeSequence();
                    break;
                }
                return true;
              }}
              onInputChange={(inputText, { action }) => {
                if (action == 'input-change') {
                  updateScreenMetadataSequence({
                    key: 'searchText',
                    value: inputText,
                  });
                }
              }}
            />
            <Text
              bind="validationErrors.documentType"
              className="usa-error-message"
            />
          </div>

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
        </NonMobile>
        <Mobile>
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
        </Mobile>
      </React.Fragment>
    );
  },
);
