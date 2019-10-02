import { Button } from '../../ustc-ui/Button/Button';
import { CompleteDocumentTypeSectionRemainder } from './CompleteDocumentTypeSectionRemainder';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Mobile } from '../../ustc-ui/Responsive/Responsive';
import { SelectDocumentWizardOverlay } from './SelectDocumentWizardOverlay/';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import {
  fileDocumentPrimaryOnChange,
  onInputChange,
  reactSelectValue,
} from '../../ustc-ui/utils/documentTypeSelectHelper';
import { sequences, state } from 'cerebral';
import React from 'react';
import Select from 'react-select';

export const CompleteDocumentTypeSection = connect(
  {
    completeDocumentTypeSectionHelper: state.completeDocumentTypeSectionHelper,
    form: state.form,
    openSelectDocumentWizardOverlaySequence:
      sequences.openSelectDocumentWizardOverlaySequence,
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
    openSelectDocumentWizardOverlaySequence,
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
            Document type
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
          <Text
            bind="validationErrors.documentType"
            className="usa-error-message"
          />
        </div>

        <CompleteDocumentTypeSectionRemainder />

        {showModal === 'SelectDocumentWizardOverlay' && (
          <SelectDocumentWizardOverlay />
        )}
      </React.Fragment>
    );
  },
);
