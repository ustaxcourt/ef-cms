import { FileUploadErrorModal } from '../FileUploadErrorModal';
import { FileUploadStatusModal } from '../FileUploadStatusModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Hint } from '../../ustc-ui/Hint/Hint';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { limitFileSize } from '../limitFileSize';
import { sequences, state } from 'cerebral';
import React from 'react';

export const StartCaseStep1 = connect(
  {
    completeStartCaseWizardStepSequence:
      sequences.completeStartCaseWizardStepSequence,
    constants: state.constants,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    showModal: state.showModal,
    startCaseHelper: state.startCaseHelper,
    submitFilePetitionSequence: sequences.submitFilePetitionSequence,
    updatePetitionValueSequence: sequences.updatePetitionValueSequence,
    updateStartCaseFormValueSequence:
      sequences.updateStartCaseFormValueSequence,
    validationErrors: state.validationErrors,
  },
  ({
    completeStartCaseWizardStepSequence,
    constants,
    formCancelToggleCancelSequence,
    showModal,
    startCaseHelper,
    submitFilePetitionSequence,
    updatePetitionValueSequence,
    validateStartCaseSequence,
    validationErrors,
  }) => {
    return (
      <>
        <h1 className="margin-bottom-2" id="start-case-header" tabIndex="-1">
          1. Provide Statement of Identity
        </h1>
        <Hint>
          The Statement of Taxpayer Identification is the only document that
          should include personal information (such as Social Security Numbers,
          Taxpayer Identification Numbers, or Employer Identification Numbers).
          It’s sent to the IRS to help identify you, but is never viewed by the
          Court or stored as part of the public record.
        </Hint>
        <div className="blue-container">
          <div
            className={`usa-form-group ${
              validationErrors.stinFile ? 'usa-form-group--error' : ''
            }`}
          >
            <label
              className={
                'usa-label ustc-upload-stin with-hint ' +
                (startCaseHelper.showStinFileValid ? 'validated' : '')
              }
              htmlFor="stin-file"
            >
              Upload Your Statement of Taxpayer Identification{' '}
              <span className="success-message">
                <FontAwesomeIcon icon="check-circle" size="1x" />
              </span>
            </label>
            <span className="usa-hint">
              File must be in PDF format (.pdf). Max file size{' '}
              {constants.MAX_FILE_SIZE_MB}MB.
            </span>
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
                  validateStartCaseSequence();
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

        <div className="button-box-container">
          <button
            className="usa-button margin-right-205 margin-bottom-4"
            id="submit-case"
            type="button"
            onClick={() => {
              completeStartCaseWizardStepSequence({ nextStep: 2 });
            }}
          >
            Continue to Step 2 of 5
          </button>
          <button
            className="usa-button usa-button--outline margin-bottom-1"
            type="button"
            onClick={() => history.back()}
          >
            Back
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
        {showModal === 'FileUploadStatusModal' && <FileUploadStatusModal />}
        {showModal === 'FileUploadErrorModal' && (
          <FileUploadErrorModal confirmSequence={submitFilePetitionSequence} />
        )}
      </>
    );
  },
);
