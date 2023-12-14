import { Button } from '../../ustc-ui/Button/Button';
import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { PIIRedactedWarning } from '@web-client/views/RequestAccess/PIIRedactedWarning';
import { StateDrivenFileInput } from '../FileDocument/StateDrivenFileInput';
import { SupportingDocuments } from '../FileDocument/SupportingDocuments';
import { TextView } from '@web-client/ustc-ui/Text/TextView';
import { WhatCanIIncludeModalOverlay } from '../FileDocument/WhatCanIIncludeModalOverlay';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const RequestAccessDocumentForm = connect(
  {
    constants: state.constants,
    form: state.form,
    formatAndUpdateDateFromDatePickerSequence:
      sequences.formatAndUpdateDateFromDatePickerSequence,
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
    formatAndUpdateDateFromDatePickerSequence,
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
        <PIIRedactedWarning />
        {requestAccessHelper.showGenerationTypeForm && (
          <div className="usa-form-group">
            <fieldset className="usa-fieldset margin-bottom-0">
              <div className="usa-radio usa-radio__inline">
                <input
                  checked={
                    form.generationType === constants.GENERATION_TYPES.AUTO
                  }
                  className="usa-radio__input"
                  id="auto-generation"
                  name="generationType"
                  type="radio"
                  onChange={() => {
                    updateCaseAssociationFormValueSequence({
                      key: 'generationType',
                      value: constants.GENERATION_TYPES.AUTO,
                    });
                  }}
                />
                <label
                  className="usa-radio__label"
                  data-testid="auto-generation"
                  htmlFor="auto-generation"
                >
                  Auto-generate Entry of Appearance PDF (Use only if you do not
                  need to add attachments or a Certificate of Service.)
                </label>
              </div>

              <input
                checked={
                  form.generationType === constants.GENERATION_TYPES.MANUAL
                }
                className="usa-radio__input"
                id="manual-generation"
                name="generationType"
                type="radio"
                onChange={() => {
                  updateCaseAssociationFormValueSequence({
                    key: 'generationType',
                    value: constants.GENERATION_TYPES.MANUAL,
                  });
                }}
              />
              <label className="usa-radio__label" htmlFor="manual-generation">
                Upload PDF form
              </label>
            </fieldset>
          </div>
        )}
        {form.generationType === constants.GENERATION_TYPES.MANUAL && (
          <>
            <div>
              <FormGroup errorText={validationErrors?.primaryDocumentFile}>
                <label
                  className={classNames(
                    'usa-label ustc-upload with-hint',
                    requestAccessHelper.showPrimaryDocumentValid && 'validated',
                  )}
                  data-testid="primary-document-label"
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
                      Certificate of Service
                    </label>
                  </div>
                </fieldset>

                {form.certificateOfService && (
                  <DateSelector
                    defaultValue={form.certificateOfServiceDate}
                    errorText={validationErrors?.certificateOfServiceDate}
                    id="service-date"
                    label="Service date"
                    onChange={e => {
                      formatAndUpdateDateFromDatePickerSequence({
                        key: 'certificateOfServiceDate',
                        toFormat: constants.DATE_FORMATS.ISO,
                        value: e.target.value,
                      });
                      validateCaseAssociationRequestSequence();
                    }}
                  />
                )}
              </div>

              {requestAccessHelper.documentWithObjections && (
                <FormGroup errorText={validationErrors?.objections}>
                  <fieldset className="usa-fieldset margin-top-2">
                    <legend id="objections-legend">
                      Are there any objections to this document?
                    </legend>
                    {constants.OBJECTIONS_OPTIONS.map(option => (
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
        )}
      </>
    );
  },
);

RequestAccessDocumentForm.displayName = 'RequestAccessDocumentForm';
