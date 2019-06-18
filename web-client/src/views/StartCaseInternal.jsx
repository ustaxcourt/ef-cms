import { ErrorNotification } from './ErrorNotification';
import { FileUploadErrorModal } from './FileUploadErrorModal';
import { FileUploadStatusModal } from './FileUploadStatusModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormCancelModalDialog } from './FormCancelModalDialog';
import { Scan } from '../ustc-ui/Scan/Scan';
import { Text } from '../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { limitFileSize } from './limitFileSize';
import { sequences, state } from 'cerebral';

import React from 'react';

export const StartCaseInternal = connect(
  {
    completeScanSequence: sequences.completeScanSequence,
    constants: state.constants,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    scanHelper: state.scanHelper,
    showModal: state.showModal,
    startCaseHelper: state.startCaseHelper,
    startScanSequence: sequences.startScanSequence,
    submitPetitionFromPaperSequence: sequences.submitPetitionFromPaperSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    updatePetitionValueSequence: sequences.updatePetitionValueSequence,
    validatePetitionFromPaperSequence:
      sequences.validatePetitionFromPaperSequence,
    validationErrors: state.validationErrors,
  },
  ({
    constants,
    scanHelper,
    showModal,
    startScanSequence,
    completeScanSequence,
    formCancelToggleCancelSequence,
    startCaseHelper,
    submitPetitionFromPaperSequence,
    updateFormValueSequence,
    updatePetitionValueSequence,
    validationErrors,
    validatePetitionFromPaperSequence,
  }) => {
    return (
      <section className="usa-section grid-container">
        <form
          role="form"
          aria-labelledby="start-case-header"
          noValidate
          onSubmit={e => {
            e.preventDefault();
            submitPetitionFromPaperSequence();
          }}
        >
          <h1 tabIndex="-1" id="start-case-header">
            Upload Documents to Create a Case
          </h1>
          {showModal === 'FormCancelModalDialogComponent' && (
            <FormCancelModalDialog onCancelSequence="closeModalAndReturnToDashboardSequence" />
          )}
          <ErrorNotification />
          <h2>Petition Documents</h2>

          <div className="blue-container">
            <div
              className={
                validationErrors.receivedAt ? 'usa-form-group--error' : ''
              }
            >
              <fieldset className="usa-fieldset">
                <legend
                  id="date-received-legend with-hint"
                  className="usa-legend"
                >
                  Date Received <span className="usa-hint">(required)</span>
                </legend>
                <div className="usa-memorable-date">
                  <div className="usa-form-group usa-form-group--month">
                    <label
                      htmlFor="date-received-month"
                      className="usa-label"
                      aria-hidden="true"
                    >
                      MM
                    </label>
                    <input
                      className="usa-input usa-input-inline"
                      aria-describedby="date-received-legend"
                      id="date-received-month"
                      name="month"
                      aria-label="month, two digits"
                      type="number"
                      min="1"
                      max="12"
                      onChange={e => {
                        updateFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                      }}
                      onBlur={() => {
                        validatePetitionFromPaperSequence();
                      }}
                    />
                  </div>
                  <div className="usa-form-group usa-form-group--day">
                    <label
                      htmlFor="date-received-day"
                      className="usa-label"
                      aria-hidden="true"
                    >
                      DD
                    </label>
                    <input
                      className="usa-input usa-input-inline"
                      aria-describedby="date-received-legend"
                      aria-label="day, two digits"
                      id="date-received-day"
                      name="day"
                      type="number"
                      min="1"
                      max="31"
                      onChange={e => {
                        updateFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                      }}
                      onBlur={() => {
                        validatePetitionFromPaperSequence();
                      }}
                    />
                  </div>
                  <div className="usa-form-group usa-form-group--year">
                    <label
                      htmlFor="date-received-year"
                      className="usa-label"
                      aria-hidden="true"
                    >
                      YYYY
                    </label>
                    <input
                      className="usa-input usa-input-inline"
                      aria-describedby="date-received-legend"
                      aria-label="year, four digits"
                      id="date-received-year"
                      name="year"
                      type="number"
                      min="1900"
                      max="2100"
                      onChange={e => {
                        updateFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                      }}
                      onBlur={() => {
                        validatePetitionFromPaperSequence();
                      }}
                    />
                  </div>
                  <Text
                    className="usa-error-message"
                    bind="validationErrors.receivedAt"
                  />
                </div>
              </fieldset>
            </div>

            <div
              className={
                'usa-form-group ' +
                (validationErrors.caseCaption ? 'usa-form-group--error' : '')
              }
            >
              <label htmlFor="case-caption" className="usa-label">
                Case Caption <span className="usa-hint">(required)</span>
              </label>
              <textarea
                id="case-caption"
                name="caseCaption"
                className="usa-textarea"
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
                onBlur={() => {
                  validatePetitionFromPaperSequence();
                }}
              />
              {constants.CASE_CAPTION_POSTFIX}
              <Text
                className="usa-error-message"
                bind="validationErrors.caseCaption"
              />
            </div>

            <div
              className={`usa-form-group ${
                validationErrors.petitionFile ? 'usa-form-group--error' : ''
              }`}
            >
              <label
                htmlFor="petition-file"
                className={
                  'usa-label ustc-upload-petition ' +
                  (startCaseHelper.showPetitionFileValid ? 'validated' : '')
                }
              >
                Upload the Petition <span className="usa-hint">(required)</span>
                <span className="success-message margin-left-2px">
                  <FontAwesomeIcon icon="check-circle" size="sm" />
                </span>
              </label>
              <input
                id="petition-file"
                type="file"
                accept=".pdf"
                aria-describedby="petition-hint"
                name="petitionFile"
                className="usa-input"
                onChange={e => {
                  limitFileSize(e, constants.MAX_FILE_SIZE_MB, () => {
                    updatePetitionValueSequence({
                      key: e.target.name,
                      value: e.target.files[0],
                    });
                    updatePetitionValueSequence({
                      key: `${e.target.name}Size`,
                      value: e.target.files[0].size,
                    });
                    validatePetitionFromPaperSequence();
                  });
                }}
              />
              <Text
                className="usa-error-message"
                bind="validationErrors.petitionFile"
              />
              <Text
                className="usa-error-message"
                bind="validationErrors.petitionFileSize"
              />
            </div>
            {scanHelper.hasScanFeature && scanHelper.scanFeatureEnabled && (
              <Scan
                onScanClicked={() => startScanSequence()}
                onDoneClicked={() =>
                  completeScanSequence({
                    onComplete: file => {
                      limitFileSize(file, constants.MAX_FILE_SIZE_MB, () => {
                        updatePetitionValueSequence({
                          key: 'petitionFile',
                          value: file,
                        });
                        updatePetitionValueSequence({
                          key: 'petitionFileSize',
                          value: file.size,
                        });
                        validatePetitionFromPaperSequence();
                      });
                    },
                  })
                }
              />
            )}
          </div>

          <h2 className="margin-top-4">Statement of Taxpayer Identification</h2>
          <div className="blue-container">
            <div
              className={`usa-form-group ${
                validationErrors.stinFile ? 'usa-form-group--error' : ''
              }`}
            >
              <label
                htmlFor="stin-file"
                className={
                  'usa-label ustc-upload-stin ' +
                  (startCaseHelper.showStinFileValid ? 'validated' : '')
                }
              >
                Upload the Statement of Taxpayer Identification
                <span className="success-message margin-left-2px">
                  <FontAwesomeIcon icon="check-circle" size="sm" />
                </span>
              </label>
              <input
                id="stin-file"
                type="file"
                accept=".pdf"
                name="stinFile"
                className="usa-input"
                onChange={e => {
                  limitFileSize(e, constants.MAX_FILE_SIZE_MB, () => {
                    updatePetitionValueSequence({
                      key: e.target.name,
                      value: e.target.files[0],
                    });
                    updatePetitionValueSequence({
                      key: `${e.target.name}Size`,
                      value: e.target.files[0].size,
                    });
                    validatePetitionFromPaperSequence();
                  });
                }}
              />
              <Text
                className="usa-error-message"
                bind="validationErrors.stinFile"
              />
              <Text
                className="usa-error-message"
                bind="validationErrors.stinFileSize"
              />
            </div>
          </div>

          <h2 className="margin-top-4">Ownership Disclosure Statement</h2>
          <div className="blue-container">
            <label
              htmlFor="ownership-disclosure-file"
              className={
                'usa-label ustc-upload-ods ' +
                (startCaseHelper.showOwnershipDisclosureValid
                  ? 'validated'
                  : '')
              }
            >
              Upload the Ownership Disclosure Statement
              <span className="success-message margin-left-2px">
                <FontAwesomeIcon icon="check-circle" size="sm" />
              </span>
            </label>
            <input
              id="ownership-disclosure-file"
              type="file"
              accept=".pdf"
              name="ownershipDisclosureFile"
              className="usa-input"
              onChange={e => {
                limitFileSize(e, constants.MAX_FILE_SIZE_MB, () => {
                  updatePetitionValueSequence({
                    key: e.target.name,
                    value: e.target.files[0],
                  });
                  updatePetitionValueSequence({
                    key: `${e.target.name}Size`,
                    value: e.target.files[0].size,
                  });
                });
              }}
            />
            <Text
              className="usa-error-message"
              bind="validationErrors.ownershipDisclosureFileSize"
            />
          </div>
          <div className="margin-top-4">
            <button
              id="submit-case"
              type="submit"
              className="usa-button margin-bottom-2"
            >
              Create Case
            </button>
            <button
              type="button"
              className="usa-button usa-button--outline"
              onClick={() => {
                formCancelToggleCancelSequence();
                return false;
              }}
            >
              Cancel
            </button>
          </div>
        </form>
        {showModal === 'FileUploadStatusModal' && <FileUploadStatusModal />}
        {showModal === 'FileUploadErrorModal' && (
          <FileUploadErrorModal
            confirmSequence={submitPetitionFromPaperSequence}
          />
        )}
      </section>
    );
  },
);
