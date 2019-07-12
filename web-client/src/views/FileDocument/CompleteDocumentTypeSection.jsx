import { CompleteDocumentTypeSectionRemainder } from './CompleteDocumentTypeSectionRemainder';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Mobile } from '../../ustc-ui/Responsive/Responsive';
import { SelectDocumentWizardModalDialog } from './SelectDocumentWizardModalDialog';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import Select from 'react-select';

export const CompleteDocumentTypeSection = connect(
  {
    completeDocumentTypeSectionHelper: state.completeDocumentTypeSectionHelper,
    form: state.form,
    openSelectDocumentWizardModalSequence:
      sequences.openSelectDocumentWizardModalSequence,
    showModal: state.showModal,
    updateFileDocumentWizardFormValueSequence:
      sequences.updateFileDocumentWizardFormValueSequence,
    updateScreenMetadataSequence: sequences.updateScreenMetadataSequence,
    validateSelectDocumentTypeSequence:
      sequences.validateSelectDocumentTypeSequence,
    validationErrors: state.validationErrors,
  },
  ({
    completeDocumentTypeSectionHelper,
    form,
    openSelectDocumentWizardModalSequence,
    showModal,
    updateFileDocumentWizardFormValueSequence,
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
            htmlFor="document-type"
            id="document-type-label"
          >
            Document Type
          </label>
          <Select
            aria-describedby="document-type-label"
            aria-labelledby="document-type-label"
            className="select-react-element"
            classNamePrefix="select-react-element"
            id="document-type"
            isClearable={true}
            name="eventCode"
            options={
              completeDocumentTypeSectionHelper.documentTypesForSelectSorted
            }
            placeholder="- Select -"
            value={completeDocumentTypeSectionHelper.documentTypesForSelectSorted.filter(
              option => option.eventCode === form.eventCode,
            )}
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
                    key: 'documentTitle',
                    value: inputValue.documentTitle,
                  });
                  updateFileDocumentWizardFormValueSequence({
                    key: 'eventCode',
                    value: inputValue.eventCode,
                  });
                  updateFileDocumentWizardFormValueSequence({
                    key: 'scenario',
                    value: inputValue.scenario,
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
          <Mobile>
            <button
              className="usa-button usa-button--unstyled"
              onClick={() => openSelectDocumentWizardModalSequence()}
            >
              <FontAwesomeIcon icon="question-circle" size="sm" />
              Need help selecting a document?
            </button>
          </Mobile>
          <Text
            bind="validationErrors.documentType"
            className="usa-error-message"
          />
        </div>

        <CompleteDocumentTypeSectionRemainder />

        {showModal === 'SelectDocumentWizardModalDialog' && (
          <SelectDocumentWizardModalDialog />
        )}
      </React.Fragment>
    );
  },
);
