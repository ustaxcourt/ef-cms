import { CompleteDocumentTypeSectionRemainder } from './CompleteDocumentTypeSectionRemainder';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { SelectDocumentWizardOverlay } from './SelectDocumentWizardOverlay';
import { SelectSearch } from '../../ustc-ui/Select/SelectSearch';
import { connect } from '@web-client/presenter/shared.cerebral';
import {
  fileDocumentPrimaryOnChange,
  onInputChange,
  reactSelectValue,
} from '../../ustc-ui/Utils/documentTypeSelectHelper';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const CompleteDocumentTypeSection = connect(
  {
    completeDocumentTypeSectionHelper: state.completeDocumentTypeSectionHelper,
    form: state.form,
    showModal: state.modal.showModal,
    updateFileDocumentWizardFormValueSequence:
      sequences.updateFileDocumentWizardFormValueSequence,
    updateScreenMetadataSequence: sequences.updateScreenMetadataSequence,
    validateSelectDocumentTypeSequence:
      sequences.validateSelectDocumentTypeSequence,
    validationErrors: state.validationErrors,
  },
  function CompleteDocumentTypeSection({
    completeDocumentTypeSectionHelper,
    form,
    showModal,
    updateFileDocumentWizardFormValueSequence,
    updateScreenMetadataSequence,
    validateSelectDocumentTypeSequence,
    validationErrors,
  }) {
    return (
      <React.Fragment>
        <FormGroup errorText={validationErrors.documentType}>
          <label
            className="usa-label"
            htmlFor="document-type"
            id="document-type-label"
          >
            Document type
          </label>

          <span className="usa-hint">
            Enter your document name to see available document types,
            <br />
            or use the dropdown to select your document type.
          </span>

          <SelectSearch
            aria-labelledby="document-type-label"
            id="document-type"
            name="eventCode"
            options={
              completeDocumentTypeSectionHelper.documentTypesForSelectSorted
            }
            value={reactSelectValue({
              documentTypes:
                completeDocumentTypeSectionHelper.documentTypesForSelectSorted,
              selectedEventCode: form.eventCode,
            })}
            onChange={(inputValue, { action }) => {
              fileDocumentPrimaryOnChange({
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

        <CompleteDocumentTypeSectionRemainder />

        {showModal === 'SelectDocumentWizardOverlay' && (
          <SelectDocumentWizardOverlay />
        )}
      </React.Fragment>
    );
  },
);

CompleteDocumentTypeSection.displayName = 'CompleteDocumentTypeSection';
