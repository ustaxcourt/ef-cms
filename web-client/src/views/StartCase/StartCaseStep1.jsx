import { ButtonLink } from '../../ustc-ui/Buttons/ButtonLink';
import { Focus } from '../../ustc-ui/Focus/Focus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Hint } from '../../ustc-ui/Hint/Hint';
import { StateDrivenFileInput } from '../FileDocument/StateDrivenFileInput';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const StartCaseStep1 = connect(
  {
    completeStartCaseWizardStepSequence:
      sequences.completeStartCaseWizardStepSequence,
    constants: state.constants,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    navigateBackSequence: sequences.navigateBackSequence,
    startCaseHelper: state.startCaseHelper,
    validationErrors: state.validationErrors,
  },
  ({
    completeStartCaseWizardStepSequence,
    constants,
    formCancelToggleCancelSequence,
    navigateBackSequence,
    startCaseHelper,
    validationErrors,
  }) => {
    return (
      <>
        <Focus>
          <h2
            className="focusable margin-bottom-2"
            id="start-case-header"
            tabIndex="-1"
          >
            1. Provide Statement of Identity
          </h2>
        </Focus>
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
              id="stin-file-label"
            >
              Upload your Statement of Taxpayer Identification{' '}
              <span className="success-message">
                <FontAwesomeIcon icon="check-circle" size="1x" />
              </span>
            </label>
            <span className="usa-hint">
              File must be in PDF format (.pdf). Max file size{' '}
              {constants.MAX_FILE_SIZE_MB}MB.
            </span>
            <StateDrivenFileInput
              aria-describedby="stin-file-label"
              id="stin-file"
              name="stinFile"
              updateFormValueSequence="updateStartCaseFormValueSequence"
              validationSequence="validateStartCaseWizardSequence"
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
            onClick={() => navigateBackSequence()}
          >
            Back
          </button>
          <ButtonLink
            onClick={() => {
              formCancelToggleCancelSequence();
            }}
          >
            Cancel
          </ButtonLink>
        </div>
      </>
    );
  },
);
