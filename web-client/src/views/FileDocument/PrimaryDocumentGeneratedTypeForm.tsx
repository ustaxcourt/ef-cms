import { Button } from '@web-client/ustc-ui/Button/Button';
import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { PIIRedactedWarning } from '@web-client/views/CaseAssociationRequest/PIIRedactedWarning';
import { StateDrivenFileInput } from './StateDrivenFileInput';
import { WhatCanIIncludeModalOverlay } from '@web-client/views/FileDocument/WhatCanIIncludeModalOverlay';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const PrimaryDocumentGeneratedTypeForm = connect(
  {
    constants: state.constants,
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
    formatAndUpdateDateFromDatePickerSequence:
      sequences.formatAndUpdateDateFromDatePickerSequence,
    openCleanModalSequence: sequences.openCleanModalSequence,
    showModal: state.modal.showModal,
    updateCaseAssociationFormValueSequence:
      sequences.updateCaseAssociationFormValueSequence,
    validateCaseAssociationRequestSequence:
      sequences.validateCaseAssociationRequestSequence,
    validationErrors: state.validationErrors,
  },
  function PrimaryDocumentGeneratedTypeForm({
    constants,
    fileDocumentHelper,
    form,
    formatAndUpdateDateFromDatePickerSequence,
    openCleanModalSequence,
    showModal,
    updateCaseAssociationFormValueSequence,
    validateCaseAssociationRequestSequence,
    validationErrors,
  }) {
    return (
      <>
        <h2 className="margin-top-4">{form.documentTitle}</h2>
        <PIIRedactedWarning />

        {fileDocumentHelper.showGenerationTypeForm && (
          <>
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
                      validateCaseAssociationRequestSequence();
                    }}
                  />
                  <label
                    className="usa-radio__label"
                    data-testid="auto-generation"
                    htmlFor="auto-generation"
                  >
                    Auto-generate Entry of Appearance PDF (Use only if you do
                    not need to add attachments or a Certificate of Service.)
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
                    validateCaseAssociationRequestSequence();
                  }}
                />
                <label
                  className="usa-radio__label"
                  data-testid="manual-generation-label"
                  htmlFor="manual-generation"
                >
                  Upload PDF form
                </label>
              </fieldset>
            </div>
          </>
        )}
        {form.generationType === constants.GENERATION_TYPES.MANUAL && (
          <>
            <div>
              <FormGroup errorText={validationErrors?.primaryDocumentFile}>
                <label
                  className={classNames(
                    'usa-label ustc-upload with-hint',
                    fileDocumentHelper.showPrimaryDocumentValid && 'validated',
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
            </div>

            {showModal === 'WhatCanIIncludeModalOverlay' && (
              <WhatCanIIncludeModalOverlay />
            )}
          </>
        )}
      </>
    );
  },
);

PrimaryDocumentGeneratedTypeForm.displayName =
  'PrimaryDocumentGeneratedTypeForm';
