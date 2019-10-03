import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Hint } from '../../ustc-ui/Hint/Hint';
import { StateDrivenFileInput } from '../FileDocument/StateDrivenFileInput';
import { SupportingDocuments } from '../FileDocument/SupportingDocuments';
import { Text } from '../../ustc-ui/Text/Text';
import { WhatCanIIncludeModalOverlay } from '../FileDocument/WhatCanIIncludeModalOverlay';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const RequestAccessDocumentForm = connect(
  {
    constants: state.constants,
    form: state.form,
    openCleanModalSequence: sequences.openCleanModalSequence,
    requestAccessHelper: state.requestAccessHelper,
    showModal: state.showModal,
    updateCaseAssociationFormValueSequence:
      sequences.updateCaseAssociationFormValueSequence,
    validateCaseAssociationRequestSequence:
      sequences.validateCaseAssociationRequestSequence,
    validationErrors: state.validationErrors,
  },
  ({
    constants,
    form,
    openCleanModalSequence,
    requestAccessHelper,
    showModal,
    updateCaseAssociationFormValueSequence,
    validateCaseAssociationRequestSequence,
    validationErrors,
  }) => {
    return (
      <>
        <h2 className="margin-top-4">Tell Us About This Document</h2>
        <Hint>
          Remember to remove or redact all personal information (such as Social
          Security Numbers, Taxpayer Identification Numbers, or Employer
          Identification Numbers) from your documents.
        </Hint>

        <div className="blue-container">
          <div
            className={`usa-form-group ${
              validationErrors.primaryDocumentFile
                ? 'usa-form-group--error'
                : ''
            }`}
          >
            <label
              className={
                'usa-label ustc-upload with-hint' +
                (requestAccessHelper.showPrimaryDocumentValid
                  ? 'validated'
                  : '')
              }
              htmlFor="primary-document"
              id="primary-document-label"
            >
              Upload your document
              <span className="success-message padding-left-1">
                <FontAwesomeIcon icon="check-circle" size="sm" />
              </span>
            </label>
            <span className="usa-hint">
              File must be in PDF format (.pdf). Max file size{' '}
              {constants.MAX_FILE_SIZE_MB}MB.
            </span>
            <StateDrivenFileInput
              aria-describedby="primary-document-label"
              id="primary-document"
              name="primaryDocumentFile"
              updateFormValueSequence="updateCaseAssociationFormValueSequence"
              validationSequence="validateCaseAssociationRequestSequence"
            />
            <Text
              bind="validationErrors.primaryDocumentFile"
              className="usa-error-message"
            />
          </div>

          <div className="usa-form-group margin-bottom-0">
            <fieldset className="usa-fieldset margin-bottom-0">
              <legend>
                Select extra items to include with your document
                <Button
                  link
                  className="margin-top-1"
                  onClick={() =>
                    openCleanModalSequence({
                      value: 'WhatCanIIncludeModalOverlay',
                    })
                  }
                >
                  <FontAwesomeIcon
                    className="margin-right-05"
                    icon="question-circle"
                    size="1x"
                  />
                  What can I include with my document?
                </Button>
              </legend>

              <div className="usa-checkbox">
                <input
                  checked={form.attachments || false}
                  className="usa-checkbox__input"
                  id="primaryDocument-attachments"
                  name="attachments"
                  type="checkbox"
                  onChange={e => {
                    updateCaseAssociationFormValueSequence({
                      key: e.target.name,
                      value: e.target.checked,
                    });
                    validateCaseAssociationRequestSequence();
                  }}
                />
                <label
                  className="usa-checkbox__label"
                  htmlFor="primaryDocument-attachments"
                >
                  Attachment(s)
                </label>
              </div>
              <div className="usa-checkbox">
                <input
                  checked={form.certificateOfService || false}
                  className="usa-checkbox__input"
                  id="primaryDocument-certificateOfService"
                  name="certificateOfService"
                  type="checkbox"
                  onChange={e => {
                    updateCaseAssociationFormValueSequence({
                      key: e.target.name,
                      value: e.target.checked,
                    });
                    validateCaseAssociationRequestSequence();
                  }}
                />
                <label
                  className="usa-checkbox__label"
                  htmlFor="primaryDocument-certificateOfService"
                >
                  Certificate of service
                </label>
              </div>
            </fieldset>

            {form.certificateOfService && (
              <fieldset
                className={`usa-fieldset margin-bottom-0 margin-top-2 ${
                  validationErrors && validationErrors.certificateOfServiceDate
                    ? 'usa-form-group--error margin-top-2'
                    : ''
                }`}
              >
                <legend className="usa-legend" id="service-date-legend">
                  Service date
                </legend>
                <div className="usa-memorable-date">
                  <div className="usa-form-group usa-form-group--month margin-bottom-0">
                    <label
                      aria-hidden="true"
                      className="usa-label"
                      htmlFor="service-date-month"
                    >
                      MM
                    </label>
                    <input
                      aria-describedby="service-date-legend"
                      aria-label="month, two digits"
                      className="usa-input usa-input-inline"
                      id="service-date-month"
                      max="12"
                      min="1"
                      name="certificateOfServiceMonth"
                      type="number"
                      value={form.certificateOfServiceMonth || ''}
                      onBlur={() => {
                        validateCaseAssociationRequestSequence();
                      }}
                      onChange={e => {
                        updateCaseAssociationFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="usa-form-group usa-form-group--day margin-bottom-0">
                    <label
                      aria-hidden="true"
                      className="usa-label"
                      htmlFor="service-date-day"
                    >
                      DD
                    </label>
                    <input
                      aria-describedby="service-date-legend"
                      aria-label="day, two digits"
                      className="usa-input usa-input-inline"
                      id="service-date-day"
                      max="31"
                      min="1"
                      name="certificateOfServiceDay"
                      type="number"
                      value={form.certificateOfServiceDay || ''}
                      onBlur={() => {
                        validateCaseAssociationRequestSequence();
                      }}
                      onChange={e => {
                        updateCaseAssociationFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="usa-form-group usa-form-group--year margin-bottom-0">
                    <label
                      aria-hidden="true"
                      className="usa-label"
                      htmlFor="service-date-year"
                    >
                      YYYY
                    </label>
                    <input
                      aria-describedby="service-date-legend"
                      aria-label="year, four digits"
                      className="usa-input usa-input-inline"
                      id="service-date-year"
                      max="2100"
                      min="1900"
                      name="certificateOfServiceYear"
                      type="number"
                      value={form.certificateOfServiceYear || ''}
                      onBlur={() => {
                        validateCaseAssociationRequestSequence();
                      }}
                      onChange={e => {
                        updateCaseAssociationFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>
              </fieldset>
            )}
            <Text
              bind="validationErrors.certificateOfServiceDate"
              className="usa-error-message"
            />
          </div>
        </div>

        {requestAccessHelper.documentWithSupportingDocuments && (
          <div>
            <SupportingDocuments />
            <Text
              bind="validationErrors.hasSupportingDocuments"
              className="usa-error-message"
            />
          </div>
        )}

        {showModal === 'WhatCanIIncludeModalOverlay' && (
          <WhatCanIIncludeModalOverlay />
        )}
      </>
    );
  },
);
