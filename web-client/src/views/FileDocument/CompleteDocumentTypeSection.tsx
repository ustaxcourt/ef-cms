import { CompleteDocumentTypeSectionRemainder } from './CompleteDocumentTypeSectionRemainder';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { SelectDocumentWizardOverlay } from './SelectDocumentWizardOverlay';
import { SelectSearch2 } from '@web-client/ustc-ui/Select/SelectSearch2';
import { connect } from '@web-client/presenter/shared.cerebral';
import { reactSelectValue } from '../../ustc-ui/Utils/documentTypeSelectHelper';
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
    validateSelectDocumentTypeSequence:
      sequences.validateSelectDocumentTypeSequence,
    validationErrors: state.validationErrors,
  },
  function CompleteDocumentTypeSection({
    completeDocumentTypeSectionHelper,
    form,
    showModal,
    updateFileDocumentWizardFormValueSequence,
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

          <SelectSearch2
            aria-labelledby="document-type-label"
            data-testid="document-type"
            id="document-type"
            isClearable={true}
            name="eventCode"
            options={
              completeDocumentTypeSectionHelper.documentTypesForSelectSorted
            }
            value={reactSelectValue({
              documentTypes:
                completeDocumentTypeSectionHelper.documentTypesForSelectSorted,
              selectedEventCode: form.eventCode,
            })}
            onChange={inputValue => {
              [
                'category',
                'documentType',
                'documentTitle',
                'eventCode',
                'scenario',
              ].forEach(key =>
                updateFileDocumentWizardFormValueSequence({
                  key,
                  value: inputValue ? inputValue[key] : '',
                }),
              );
              validateSelectDocumentTypeSequence();
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
