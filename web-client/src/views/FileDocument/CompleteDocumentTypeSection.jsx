import { Button } from '../../ustc-ui/Button/Button';
import { CompleteDocumentTypeSectionRemainder } from './CompleteDocumentTypeSectionRemainder';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { Mobile } from '../../ustc-ui/Responsive/Responsive';
import { SelectDocumentWizardOverlay } from './SelectDocumentWizardOverlay/';
import { SelectSearch } from '../../ustc-ui/Select/SelectSearch';
import { connect } from '@cerebral/react';
import {
  fileDocumentPrimaryOnChange,
  onInputChange,
  reactSelectValue,
} from '../../ustc-ui/utils/documentTypeSelectHelper';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CompleteDocumentTypeSection = connect(
  {
    completeDocumentTypeSectionHelper: state.completeDocumentTypeSectionHelper,
    form: state.form,
    openSelectDocumentWizardOverlaySequence:
      sequences.openSelectDocumentWizardOverlaySequence,
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
    openSelectDocumentWizardOverlaySequence,
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
          <Mobile>
            <Button
              link
              className="margin-top-1"
              onClick={() => openSelectDocumentWizardOverlaySequence()}
            >
              <FontAwesomeIcon icon="question-circle" size="sm" />
              Need help selecting a document?
            </Button>
          </Mobile>
        </FormGroup>

        <CompleteDocumentTypeSectionRemainder />

        {showModal === 'SelectDocumentWizardOverlay' && (
          <SelectDocumentWizardOverlay />
        )}
      </React.Fragment>
    );
  },
);
