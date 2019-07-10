import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import Select from 'react-select';

export const DocumentTypeSelect = connect(
  {
    form: state.form,
    selectDocumentSelectHelper: state.selectDocumentSelectHelper,
    selectDocumentSequence: sequences.selectDocumentSequence,
    updateFileDocumentSelectFormValueSequence:
      sequences.updateFileDocumentSelectFormValueSequence,
    updateScreenMetadataSequence: sequences.updateScreenMetadataSequence,
    validateSelectDocumentTypeSequence:
      sequences.validateSelectDocumentTypeSequence,
    validationErrors: state.validationErrors,
  },
  ({
    selectDocumentSelectHelper,
    updateFileDocumentSelectFormValueSequence,
    updateScreenMetadataSequence,
    validateSelectDocumentTypeSequence,
    validationErrors,
  }) => {
    return (
      <React.Fragment>
        <div
          className={`usa-form-group ${
            validationErrors.documentType ? 'usa-form-group--error' : ''
          }`}
        >
          <label
            className="usa-label"
            htmlFor="react-select-2-input"
            id="document-type-label"
          >
            Document Type
          </label>
          <Select
            aria-describedby="document-type-label"
            className="select-react-element"
            classNamePrefix="select-react-element"
            id="document-type"
            isClearable={true}
            name="eventCode"
            options={selectDocumentSelectHelper.documentTypesForSelectSorted}
            placeholder="- Select -"
            onChange={(inputValue, { action, name }) => {
              switch (action) {
                case 'select-option':
                  updateFileDocumentSelectFormValueSequence({
                    key: name,
                    value: inputValue.value,
                  });
                  validateSelectDocumentTypeSequence();
                  break;
                case 'clear':
                  updateFileDocumentSelectFormValueSequence({
                    key: name,
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
      </React.Fragment>
    );
  },
);
