import { Button } from '../../ustc-ui/Button/Button';
import { DateInput } from '../../ustc-ui/DateInput/DateInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { Hint } from '../../ustc-ui/Hint/Hint';
import { StateDrivenFileInput } from '../FileDocument/StateDrivenFileInput';
import { SupportingDocuments } from '../FileDocument/SupportingDocuments';
import { TextView } from '../../ustc-ui/Text/TextView';
import { WhatCanIIncludeModalOverlay } from '../FileDocument/WhatCanIIncludeModalOverlay';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const RequestAccessDocumentForm = connect(
  {
    OBJECTIONS_OPTIONS: state.constants.OBJECTIONS_OPTIONS,
    constants: state.constants,
    form: state.form,
    openCleanModalSequence: sequences.openCleanModalSequence,
    requestAccessHelper: state.requestAccessHelper,
    showModal: state.modal.showModal,
    updateCaseAssociationFormValueSequence:
      sequences.updateCaseAssociationFormValueSequence,
    validateCaseAssociationRequestSequence:
      sequences.validateCaseAssociationRequestSequence,
    validationErrors: state.validationErrors,
  },
  function RequestAccessDocumentForm({
    constants,
    form,
    OBJECTIONS_OPTIONS,
    openCleanModalSequence,
    requestAccessHelper,
    showModal,
    updateCaseAssociationFormValueSequence,
    validateCaseAssociationRequestSequence,
    validationErrors,
  }) {
    return (
      <>
        <h2 className="margin-top-4">Tell Us About This Document</h2>
        <Hint>
          Remember to remove or redact all personal information (such as Social
          Security Numbers, Taxpayer Identification Numbers, or Employer
          Identification Numbers) from your documents.
        </Hint>

        <div className="blue-container">
          <FormGroup errorText={validationErrors?.primaryDocumentFile}>
            <label
              className={classNames(
                'usa-label ustc-upload with-hint',
                requestAccessHelper.showPrimaryDocumentValid && 'validated',
              )}
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
          </FormGroup>

          <div className="usa-form-group margin-bottom-0">
            <fieldset className="usa-fieldset margin-bottom-0">
              <legend>
                Select extra items to include with your document
                <Button
                  link
                  className="margin-top-1"
                  onClick={() =>
                    openCleanModalSequence({
                      showModal: 'WhatCanIIncludeModalOverlay',
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
                  className="usa-checkbox__label inline-block"
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
                  className="usa-checkbox__label inline-block"
                  htmlFor="primaryDocument-certificateOfService"
                >
                  Certificate of Service
                </label>
              </div>
            </fieldset>

            {form.certificateOfService && (
              <DateInput
                errorText={validationErrors?.certificateOfServiceDate}
                id="service-date"
                label="Service date"
                names={{
                  day: 'certificateOfServiceDay',
                  month: 'certificateOfServiceMonth',
                  year: 'certificateOfServiceYear',
                }}
                values={{
                  day: form.certificateOfServiceDay,
                  month: form.certificateOfServiceMonth,
                  year: form.certificateOfServiceYear,
                }}
                onBlur={validateCaseAssociationRequestSequence}
                onChange={updateCaseAssociationFormValueSequence}
              />
            )}
          </div>

          {requestAccessHelper.documentWithObjections && (
            <FormGroup errorText={validationErrors?.objections}>
              <fieldset className="usa-fieldset margin-bottom-0">
                <legend id="objections-legend">
                  Are there any objections to this document?
                </legend>
                {OBJECTIONS_OPTIONS.map(option => (
                  <div className="usa-radio usa-radio__inline" key={option}>
                    <input
                      aria-describedby="objections-legend"
                      checked={form.objections === option}
                      className="usa-radio__input"
                      id={`objections-${option}`}
                      name="objections"
                      type="radio"
                      value={option}
                      onChange={e => {
                        updateCaseAssociationFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                        validateCaseAssociationRequestSequence();
                      }}
                    />
                    <label
                      className="usa-radio__label"
                      htmlFor={`objections-${option}`}
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </fieldset>
            </FormGroup>
          )}
        </div>

        {requestAccessHelper.documentWithSupportingDocuments && (
          <div>
            <SupportingDocuments />
            <TextView
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
