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
          noValidate
          aria-labelledby="start-case-header"
          role="form"
          onSubmit={e => {
            e.preventDefault();
            submitPetitionFromPaperSequence();
          }}
        >
          <h1 id="start-case-header" tabIndex="-1">
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
                  className="usa-legend"
                  id="date-received-legend with-hint"
                >
                  Date Received <span className="usa-hint">(required)</span>
                </legend>
                <div className="usa-memorable-date">
                  <div className="usa-form-group usa-form-group--month">
                    <label
                      aria-hidden="true"
                      className="usa-label"
                      htmlFor="date-received-month"
                    >
                      MM
                    </label>
                    <input
                      aria-describedby="date-received-legend"
                      aria-label="month, two digits"
                      className="usa-input usa-input-inline"
                      id="date-received-month"
                      max="12"
                      min="1"
                      name="month"
                      type="number"
                      onBlur={() => {
                        validatePetitionFromPaperSequence();
                      }}
                      onChange={e => {
                        updateFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="usa-form-group usa-form-group--day">
                    <label
                      aria-hidden="true"
                      className="usa-label"
                      htmlFor="date-received-day"
                    >
                      DD
                    </label>
                    <input
                      aria-describedby="date-received-legend"
                      aria-label="day, two digits"
                      className="usa-input usa-input-inline"
                      id="date-received-day"
                      max="31"
                      min="1"
                      name="day"
                      type="number"
                      onBlur={() => {
                        validatePetitionFromPaperSequence();
                      }}
                      onChange={e => {
                        updateFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="usa-form-group usa-form-group--year">
                    <label
                      aria-hidden="true"
                      className="usa-label"
                      htmlFor="date-received-year"
                    >
                      YYYY
                    </label>
                    <input
                      aria-describedby="date-received-legend"
                      aria-label="year, four digits"
                      className="usa-input usa-input-inline"
                      id="date-received-year"
                      max="2100"
                      min="1900"
                      name="year"
                      type="number"
                      onBlur={() => {
                        validatePetitionFromPaperSequence();
                      }}
                      onChange={e => {
                        updateFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <Text
                    bind="validationErrors.receivedAt"
                    className="usa-error-message"
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
              <label className="usa-label" htmlFor="case-caption">
                Case Caption <span className="usa-hint">(required)</span>
              </label>
              <textarea
                className="usa-textarea"
                id="case-caption"
                name="caseCaption"
                onBlur={() => {
                  validatePetitionFromPaperSequence();
                }}
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
              {constants.CASE_CAPTION_POSTFIX}
              <Text
                bind="validationErrors.caseCaption"
                className="usa-error-message"
              />
            </div>

            <div
              className={`usa-form-group ${
                validationErrors.petitionFile ? 'usa-form-group--error' : ''
              }`}
            >
              <label
                className={
                  'usa-label ustc-upload-petition ' +
                  (startCaseHelper.showPetitionFileValid ? 'validated' : '')
                }
                htmlFor="petition-file"
              >
                Upload the Petition <span className="usa-hint">(required)</span>
                <span className="success-message margin-left-2px">
                  <FontAwesomeIcon icon="check-circle" size="sm" />
                </span>
              </label>
              <input
                accept=".pdf"
                aria-describedby="petition-hint"
                className="usa-input"
                id="petition-file"
                name="petitionFile"
                type="file"
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
                bind="validationErrors.petitionFile"
                className="usa-error-message"
              />
              <Text
                bind="validationErrors.petitionFileSize"
                className="usa-error-message"
              />
            </div>
            {scanHelper.hasScanFeature && scanHelper.scanFeatureEnabled && (
              <Scan
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
                onScanClicked={() => startScanSequence()}
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
                className={
                  'usa-label ustc-upload-stin ' +
                  (startCaseHelper.showStinFileValid ? 'validated' : '')
                }
                htmlFor="stin-file"
              >
                Upload the Statement of Taxpayer Identification
                <span className="success-message margin-left-2px">
                  <FontAwesomeIcon icon="check-circle" size="sm" />
                </span>
              </label>
              <input
                accept=".pdf"
                className="usa-input"
                id="stin-file"
                name="stinFile"
                type="file"
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
                bind="validationErrors.stinFile"
                className="usa-error-message"
              />
              <Text
                bind="validationErrors.stinFileSize"
                className="usa-error-message"
              />
            </div>
          </div>

          <h2 className="margin-top-4">Ownership Disclosure Statement</h2>
          <div className="blue-container">
            <label
              className={
                'usa-label ustc-upload-ods ' +
                (startCaseHelper.showOwnershipDisclosureValid
                  ? 'validated'
                  : '')
              }
              htmlFor="ownership-disclosure-file"
            >
              Upload the Ownership Disclosure Statement
              <span className="success-message margin-left-2px">
                <FontAwesomeIcon icon="check-circle" size="sm" />
              </span>
            </label>
            <input
              accept=".pdf"
              className="usa-input"
              id="ownership-disclosure-file"
              name="ownershipDisclosureFile"
              type="file"
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
              bind="validationErrors.ownershipDisclosureFileSize"
              className="usa-error-message"
            />
          </div>
          <div className="margin-top-4">
            <button
              className="usa-button margin-bottom-2"
              id="submit-case"
              type="submit"
            >
              Create Case
            </button>
            <button
              className="usa-button usa-button--outline"
              type="button"
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
