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
    reviewRequestAccessInformationSequence,
    validationErrors,
    updateCaseAssociationFormValueSequence,
    validateCaseAssociationRequestSequence,
  }) => {
    return (
      <React.Fragment>
        <Focus>
          <h1 tabIndex="-1" id="file-a-document-header">
            Request Access to This Case
          </h1>
        </Focus>
        <p className="required-statement margin-top-05 margin-bottom-5">
          All fields required unless otherwise noted
        </p>
        <div>
          <h2 className="header-with-link-button">
            Type of Document You’re Filing
          </h2>
        </div>
        <div className="blue-container">
          <div
            className={`usa-form-group ${
              validationErrors.documentType ? 'usa-form-group--error' : ''
            }`}
          >
            <fieldset className="usa-fieldset">
              <legend>Document Type</legend>
              {[
                {
                  documentTitleTemplate:
                    'Entry of Appearance for [Petitioner Names]',
                  documentType: 'Entry of Appearance',
                  eventCode: 'EA',
                  scenario: 'Standard',
                },
                {
                  documentTitleTemplate:
                    'Substitution of Counsel for [Petitioner Names]',
                  documentType: 'Substitution of Counsel',
                  eventCode: 'SOC',
                  scenario: 'Standard',
                },
                {
                  documentTitleTemplate:
                    'Motion to Substitute Parties and Change Caption for [Petitioner Names]',
                  documentType:
                    'Motion to Substitute Parties and Change Caption',
                  eventCode: 'M107',
                  scenario: 'Standard',
                },
                {
                  documentTitleTemplate:
                    'Notice of Intervention for [Petitioner Names]',
                  documentType: 'Notice of Intervention',
                  eventCode: 'NOI',
                  scenario: 'Standard',
                },
                {
                  documentTitleTemplate:
                    'Notice of Election to Participate for [Petitioner Names]',
                  documentType: 'Notice of Election to Participate',
                  eventCode: 'NOEP',
                  scenario: 'Standard',
                },
                {
                  documentTitleTemplate:
                    'Notice of Election to Intervene for [Petitioner Names]',
                  documentType: 'Notice of Election to Intervene',
                  eventCode: 'NOEI',
                  scenario: 'Standard',
                },
              ].map((option, index) => (
                <div className="usa-radio" key={index}>
                  <input
                    id={`document-type-${index}`}
                    className="usa-radio__input"
                    type="radio"
                    name="documentType"
                    value={option.documentType}
                    checked={form.documentType === option.documentType}
                    onChange={e => {
                      updateCaseAssociationFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                      updateCaseAssociationFormValueSequence({
                        key: 'documentTitleTemplate',
                        value: option.documentTitleTemplate,
                      });
                      updateCaseAssociationFormValueSequence({
                        key: 'eventCode',
                        value: option.eventCode,
                      });
                      updateCaseAssociationFormValueSequence({
                        key: 'scenario',
                        value: option.scenario,
                      });
                      validateCaseAssociationRequestSequence();
                    }}
                  />
                  <label
                    htmlFor={`document-type-${index}`}
                    className="usa-radio__label"
                  >
                    {option.documentType}
                  </label>
                </div>
              ))}
            </fieldset>
            <Text
              className="usa-error-message"
              bind="validationErrors.documentType"
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
              reviewRequestAccessInformationSequence();
            }}
          >
            Review Filing
          </button>
          <button
            type="button"
            className="usa-button usa-button--outline"
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
