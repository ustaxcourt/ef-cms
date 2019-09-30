import { Focus } from '../../ustc-ui/Focus/Focus';
import { PartiesRepresenting } from './PartiesRepresenting';
import { RequestAccessDocumentForm } from './RequestAccessDocumentForm';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { reactSelectValue } from '../../ustc-ui/utils/documentTypeSelectHelper';
import { sequences, state } from 'cerebral';
import React from 'react';
import Select from 'react-select';

export const RequestAccess = connect(
  {
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    requestAccessHelper: state.requestAccessHelper,
    reviewRequestAccessInformationSequence:
      sequences.reviewRequestAccessInformationSequence,
    updateCaseAssociationFormValueSequence:
      sequences.updateCaseAssociationFormValueSequence,
    validateCaseAssociationRequestSequence:
      sequences.validateCaseAssociationRequestSequence,
    validationErrors: state.validationErrors,
  },
  ({
    form,
    formCancelToggleCancelSequence,
    requestAccessHelper,
    reviewRequestAccessInformationSequence,
    updateCaseAssociationFormValueSequence,
    validateCaseAssociationRequestSequence,
    validationErrors,
  }) => {
    return (
      <React.Fragment>
        <Focus>
          <h1
            className="margin-bottom-105"
            id="file-a-document-header"
            tabIndex="-1"
          >
            Request Access to This Case
          </h1>
        </Focus>
        <p className="required-statement margin-top-0 margin-bottom-4">
          *All fields required unless otherwise noted
        </p>
        <div>
          <h2 className="header-with-link-button">
            Type of Document You’re Filing
          </h2>
        </div>
        <div className="blue-container">
          <div
            className={`usa-form-group margin-bottom-0 ${
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
              className={`select-react-element ${
                validationErrors.documentType ? 'usa-select--error' : ''
              }`}
              classNamePrefix="select-react-element"
              id="document-type"
              name="documentType"
              options={requestAccessHelper.documentsForSelect}
              placeholder="- Select -"
              value={reactSelectValue({
                documentTypes: requestAccessHelper.documentsForSelect,
                selectedEventCode: form.eventCode,
              })}
              onChange={e => {
                updateCaseAssociationFormValueSequence({
                  key: 'documentType',
                  value: e.label,
                });
                updateCaseAssociationFormValueSequence({
                  key: 'documentTitleTemplate',
                  value: e.documentTitleTemplate,
                });
                updateCaseAssociationFormValueSequence({
                  key: 'eventCode',
                  value: e.eventCode,
                });
                updateCaseAssociationFormValueSequence({
                  key: 'scenario',
                  value: e.scenario,
                });
                validateCaseAssociationRequestSequence();
              }}
            />
            <Text
              bind="validationErrors.documentType"
              className="usa-error-message"
            />
          </div>
        </div>
        <RequestAccessDocumentForm />
        {requestAccessHelper.showPartiesRepresenting && <PartiesRepresenting />}
        <div className="button-box-container">
          <button
            className="usa-button"
            id="submit-document"
            type="submit"
            onClick={() => {
              reviewRequestAccessInformationSequence();
            }}
          >
            Review Filing
          </button>
          <button
            className="usa-button usa-button--unstyled ustc-button--unstyled"
            type="button"
            onClick={() => {
              formCancelToggleCancelSequence();
            }}
          >
            Cancel
          </button>
        </div>
      </React.Fragment>
    );
  },
);
