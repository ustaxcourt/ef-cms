import { Focus } from '../../ustc-ui/Focus/Focus';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { NonstandardForm } from './NonstandardForm';
import { SelectSearch } from '../../ustc-ui/Select/SelectSearch';
import { connect } from '@cerebral/react';
import {
  fileDocumentSecondaryOnChange,
  onInputChange,
  reactSelectValue,
} from '../../ustc-ui/utils/documentTypeSelectHelper';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CompleteDocumentTypeSectionRemainder = connect(
  {
    completeDocumentTypeSectionHelper: state.completeDocumentTypeSectionHelper,
    form: state.form,
    updateFileDocumentWizardFormValueSequence:
      sequences.updateFileDocumentWizardFormValueSequence,
    updateScreenMetadataSequence: sequences.updateScreenMetadataSequence,
    validateSelectDocumentTypeSequence:
      sequences.validateSelectDocumentTypeSequence,
    validationErrors: state.validationErrors,
  },
  function CompleteDocumentTypeSectionRemainder({
    completeDocumentTypeSectionHelper,
    form,
    updateFileDocumentWizardFormValueSequence,
    updateScreenMetadataSequence,
    validateSelectDocumentTypeSequence,
    validationErrors,
  }) {
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
            <div className="usa-label">
              <Focus>
                <h4 className="focusable usa-label" tabIndex="-1">
                  Which Document Are You Requesting Leave to File For?
                </h4>
              </Focus>
            </div>
            <FormGroup
              errorText={
                validationErrors.secondaryDocument &&
                validationErrors.secondaryDocument.documentType
              }
            >
              <label
                className="usa-label"
                htmlFor="secondary-doc-secondary-document-type"
                id="secondary-document-type-label"
              >
                Document type
              </label>

              <span className="usa-hint">
                Enter your document name to see available document types,
                <br />
                or use the dropdown to select your document type.
              </span>

              <SelectSearch
                aria-describedby="secondary-document-type-label"
                aria-labelledby="secondary-document-type-label"
                id="secondary-doc-secondary-document-type"
                name="secondaryDocument.eventCode"
                options={
                  completeDocumentTypeSectionHelper.documentTypesForSecondarySelectSorted
                }
                placeholder="- Select -"
                value={reactSelectValue({
                  documentTypes:
                    completeDocumentTypeSectionHelper.documentTypesForSecondarySelectSorted,
                  selectedEventCode: form.secondaryDocument.eventCode,
                })}
                onChange={(inputValue, { action }) => {
                  fileDocumentSecondaryOnChange({
                    action,
                    inputValue,
                    updateSequence: updateFileDocumentWizardFormValueSequence,
                    validateSequence: validateSelectDocumentTypeSequence,
                  });
                  return true;
                }}
                onInputChange={(inputText, { action }) => {
                  onInputChange({
                    action,
                    inputText,
                    updateSequence: updateScreenMetadataSequence,
                  });
                }}
              />
            </FormGroup>
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
