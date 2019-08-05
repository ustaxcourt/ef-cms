import { Focus } from '../../ustc-ui/Focus/Focus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Mobile } from '../../ustc-ui/Responsive/Responsive';
import { NonstandardForm } from './NonstandardForm';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import Select from 'react-select';

export const CompleteDocumentTypeSectionRemainder = connect(
  {
    completeDocumentTypeSectionHelper: state.completeDocumentTypeSectionHelper,
    form: state.form,
    openSelectDocumentWizardOverlaySequence:
      sequences.openSelectDocumentWizardOverlaySequence,
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
    openSelectDocumentWizardOverlaySequence,
    updateFileDocumentWizardFormValueSequence,
    updateScreenMetadataSequence,
    validateSelectDocumentTypeSequence,
    validationErrors,
  }) => {
    return (
      <React.Fragment>
        {completeDocumentTypeSectionHelper.primary.showNonstandardForm && (
          <NonstandardForm
            helper="completeDocumentTypeSectionHelper"
            level="primary"
            updateSequence="updateFileDocumentWizardFormValueSequence"
            validateSequence="validateSelectDocumentTypeSequence"
            validationErrors="validationErrors"
          />
        )}

        {completeDocumentTypeSectionHelper.secondary && (
          <>
            <Focus>
              <h4 className="focusable" tabIndex="-1">
                Which Document Are You Requesting Leave to File For?
              </h4>
            </Focus>
            <div
              className={`usa-form-group ${
                validationErrors.secondaryDocument &&
                validationErrors.secondaryDocument.documentType
                  ? 'usa-form-group--error'
                  : ''
              }`}
            >
              <label
                className="usa-label"
                htmlFor="secondary-doc-secondary-document-type"
                id="secondary-document-type-label"
              >
                Document Type
              </label>
              <Select
                aria-describedby="secondary-document-type-label"
                aria-labelledby="secondary-document-type-label"
                className="select-react-element"
                classNamePrefix="select-react-element"
                id="secondary-doc-secondary-document-type"
                isClearable={true}
                name="secondaryDocument.eventCode"
                options={
                  completeDocumentTypeSectionHelper.documentTypesForSecondarySelectSorted
                }
                placeholder="- Select -"
                value={completeDocumentTypeSectionHelper.documentTypesForSecondarySelectSorted.filter(
                  option =>
                    option.eventCode === form.secondaryDocument.eventCode,
                )}
                onChange={(inputValue, { action }) => {
                  switch (action) {
                    case 'select-option':
                      updateFileDocumentWizardFormValueSequence({
                        key: 'secondaryDocument.category',
                        value: inputValue.category,
                      });
                      updateFileDocumentWizardFormValueSequence({
                        key: 'secondaryDocument.documentType',
                        value: inputValue.documentType,
                      });
                      updateFileDocumentWizardFormValueSequence({
                        key: 'secondaryDocument.documentTitle',
                        value: inputValue.documentTitle,
                      });
                      updateFileDocumentWizardFormValueSequence({
                        key: 'secondaryDocument.eventCode',
                        value: inputValue.eventCode,
                      });
                      updateFileDocumentWizardFormValueSequence({
                        key: 'secondaryDocument.scenario',
                        value: inputValue.scenario,
                      });
                      validateSelectDocumentTypeSequence();
                      break;
                    case 'clear':
                      updateFileDocumentWizardFormValueSequence({
                        key: 'secondaryDocument.category',
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
                  className="usa-button usa-button--unstyled margin-top-2"
                  onClick={() =>
                    openSelectDocumentWizardOverlaySequence({
                      forSecondary: true,
                    })
                  }
                >
                  <FontAwesomeIcon icon="question-circle" size="sm" />
                  Need help selecting a document?
                </button>
              </Mobile>
              <Text
                bind="validationErrors.secondaryDocument.documentType"
                className="usa-error-message"
              />
            </div>
            {completeDocumentTypeSectionHelper.secondary
              .showNonstandardForm && (
              <NonstandardForm
                helper="completeDocumentTypeSectionHelper"
                level="secondary"
                namespace="secondaryDocument"
                updateSequence="updateFileDocumentWizardFormValueSequence"
                validateSequence="validateSelectDocumentTypeSequence"
                validationErrors="validationErrors.secondaryDocument"
              />
            )}
          </>
        )}
      </React.Fragment>
    );
  },
);
