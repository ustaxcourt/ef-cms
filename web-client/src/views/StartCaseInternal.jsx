import { BigHeader } from './BigHeader';
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
    completeScanSequence,
    constants,
    formCancelToggleCancelSequence,
    scanHelper,
    showModal,
    startCaseHelper,
    startScanSequence,
    submitPetitionFromPaperSequence,
    updateFormValueSequence,
    updatePetitionValueSequence,
    validatePetitionFromPaperSequence,
    validationErrors,
  }) => {
    return (
      <>
        <BigHeader text="Create Case" />
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
            {showModal === 'FormCancelModalDialog' && (
              <FormCancelModalDialog onCancelSequence="closeModalAndReturnToDashboardSequence" />
            )}
            <ErrorNotification />
            <div className="grid-row grid-gap">
              <div className="grid-col-5">
                <h1>Case Information</h1>
                <p className="required-statement margin-top-0 margin-bottom-4">
                  All fields required unless otherwise noted
                </p>

                <div className="blue-container">
                  <div
                    className={`usa-form-group ${
                      validationErrors.petitionFile
                        ? 'usa-form-group--error'
                        : ''
                    }`}
                  >
                    <label
                      className={
                        'usa-label ustc-upload-petition ' +
                        (startCaseHelper.showPetitionFileValid
                          ? 'validated'
                          : '')
                      }
                      htmlFor="petition-file"
                    >
                      Upload Your Petition{' '}
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
                            limitFileSize(
                              file,
                              constants.MAX_FILE_SIZE_MB,
                              () => {
                                updatePetitionValueSequence({
                                  key: 'petitionFile',
                                  value: file,
                                });
                                updatePetitionValueSequence({
                                  key: 'petitionFileSize',
                                  value: file.size,
                                });
                                validatePetitionFromPaperSequence();
                              },
                            );
                          },
                        })
                      }
                      onScanClicked={() => startScanSequence()}
                    />
                  )}

                  <div
                    className={`usa-form-group ${
                      validationErrors.stinFileSize
                        ? 'usa-form-group--error'
                        : ''
                    }`}
                  >
                    <label
                      className={
                        'usa-label ustc-upload-stin ' +
                        (startCaseHelper.showStinFileValid ? 'validated' : '')
                      }
                      htmlFor="stin-file"
                    >
                      Upload Your Statement of Taxpayer Identification{' '}
                      <span className="usa-hint">(optional)</span>
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
                      bind="validationErrors.stinFileSize"
                      className="usa-error-message"
                    />
                  </div>

                  <div
                    className={`usa-form-group ${
                      validationErrors.requestForPlaceOfTrialFileSize
                        ? 'usa-form-group--error'
                        : ''
                    }`}
                  >
                    <label
                      className={
                        'usa-label ustc-upload-rpt ' +
                        (startCaseHelper.showRequestForPlaceOfTrialFileValid
                          ? 'validated'
                          : '')
                      }
                      htmlFor="rpt-file"
                    >
                      Upload Your Request for Place of Trial{' '}
                      <span className="usa-hint">(optional)</span>
                      <span className="success-message margin-left-2px">
                        <FontAwesomeIcon icon="check-circle" size="sm" />
                      </span>
                    </label>
                    <input
                      accept=".pdf"
                      className="usa-input"
                      id="rpt-file"
                      name="requestForPlaceOfTrialFile"
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
                      bind="validationErrors.requestForPlaceOfTrialFileSize"
                      className="usa-error-message"
                    />
                  </div>

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
                        Date Received
                      </legend>
                      <div className="usa-memorable-date">
                        <div className="usa-form-group usa-form-group--month">
                          <input
                            aria-describedby="date-received-legend"
                            aria-label="month, two digits"
                            className="usa-input usa-input-inline"
                            id="date-received-month"
                            max="12"
                            min="1"
                            name="month"
                            placeholder="MM"
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
                          <input
                            aria-describedby="date-received-legend"
                            aria-label="day, two digits"
                            className="usa-input usa-input-inline"
                            id="date-received-day"
                            max="31"
                            min="1"
                            name="day"
                            placeholder="DD"
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
                          <input
                            aria-describedby="date-received-legend"
                            aria-label="year, four digits"
                            className="usa-input usa-input-inline"
                            id="date-received-year"
                            max="2100"
                            min="1900"
                            name="year"
                            placeholder="YYYY"
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
                      (validationErrors.caseCaption
                        ? 'usa-form-group--error'
                        : '')
                    }
                  >
                    <label className="usa-label" htmlFor="case-caption">
                      Case Caption
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
                    <p>{constants.CASE_CAPTION_POSTFIX}</p>
                    <Text
                      bind="validationErrors.caseCaption"
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
              </div>
            </div>
          </form>
          {showModal === 'FileUploadStatusModal' && <FileUploadStatusModal />}
          {showModal === 'FileUploadErrorModal' && (
            <FileUploadErrorModal
              confirmSequence={submitPetitionFromPaperSequence}
            />
          )}
        </section>
      </>
    );
  },
);
