import { Focus } from '../../ustc-ui/Focus/Focus';
import { PartiesRepresenting } from './PartiesRepresenting';
import { RequestAccessDocumentForm } from './RequestAccessDocumentForm';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const RequestAccess = connect(
  {
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    reviewExternalDocumentInformationSequence:
      sequences.reviewExternalDocumentInformationSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateExternalDocumentInformationSequence:
      sequences.validateExternalDocumentInformationSequence,
    validationErrors: state.validationErrors,
  },
  ({
    form,
    formCancelToggleCancelSequence,
    reviewExternalDocumentInformationSequence,
    validationErrors,
    updateFormValueSequence,
    validateExternalDocumentInformationSequence,
  }) => {
    return (
      <React.Fragment>
        <Focus>
          <h2 tabIndex="-1" id="file-a-document-header">
            Request Access to This Case
          </h2>
        </Focus>
        <p>All fields required unless otherwise noted</p>
        <div>
          <h3 className="header-with-link-button">
            Type of Document You’re Filing
          </h3>
        </div>
        <div className="blue-container">
          <div
            className={`ustc-form-group ${
              validationErrors.documentType ? 'usa-input-error' : ''
            }`}
          >
            <fieldset className="usa-fieldset-inputs usa-sans">
              <legend>Document Type</legend>
              <ul className="ustc-vertical-option-list">
                {['Entry of Appearance', 'Substitution of Counsel'].map(
                  option => (
                    <li key={option}>
                      <input
                        id={`document-type-${option}`}
                        type="radio"
                        name="documentType"
                        value={option}
                        checked={form.documentType === option}
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value === 'Yes',
                          });
                          validateExternalDocumentInformationSequence();
                        }}
                      />
                      <label htmlFor={`document-type-${option}`}>
                        {option}
                      </label>
                    </li>
                  ),
                )}
              </ul>
            </fieldset>
            <Text
              className="usa-input-error-message"
              bind="validationErrors.certificateOfService"
            />
          </div>
        </div>

        <RequestAccessDocumentForm />

        <PartiesRepresenting />

        <div className="button-box-container">
          <button
            id="submit-document"
            type="submit"
            className="usa-button"
            onClick={() => {
              reviewExternalDocumentInformationSequence();
            }}
          >
            Review Filing
          </button>
          <button
            type="button"
            className="usa-button-secondary"
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
