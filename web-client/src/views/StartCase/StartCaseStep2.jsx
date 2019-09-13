import { CaseTypeSelect } from './CaseTypeSelect';
import { Focus } from '../../ustc-ui/Focus/Focus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Hint } from '../../ustc-ui/Hint/Hint';
import { StateDrivenFileInput } from '../FileDocument/StateDrivenFileInput';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const StartCaseStep2 = connect(
  {
    caseTypeDescriptionHelper: state.caseTypeDescriptionHelper,
    completeStartCaseWizardStepSequence:
      sequences.completeStartCaseWizardStepSequence,
    constants: state.constants,
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    startCaseHelper: state.startCaseHelper,
    updateStartCaseFormValueSequence:
      sequences.updateStartCaseFormValueSequence,
    validateStartCaseWizardSequence: sequences.validateStartCaseWizardSequence,
    validationErrors: state.validationErrors,
  },
  ({
    caseTypeDescriptionHelper,
    completeStartCaseWizardStepSequence,
    constants,
    form,
    formCancelToggleCancelSequence,
    startCaseHelper,
    updateStartCaseFormValueSequence,
    validateStartCaseWizardSequence,
    validationErrors,
  }) => {
    return (
      <>
        <Focus>
          <h1 className="focusable margin-top-5" tabIndex="-1">
            2. Tell Us About Your Petition
          </h1>
        </Focus>
        <p className="required-statement margin-top-05 margin-bottom-2">
          All fields required unless otherwise noted
        </p>
        <h2 className="margin-top-4">Upload Your Petition</h2>
        <Hint>
          Don’t forget to remove or redact your personal information on all your
          documents, including any IRS notice(s).
        </Hint>
        <div className="blue-container grid-container padding-x-0">
          <div className="grid-row grid-gap">
            <div className="mobile-lg:grid-col-5">
              <div
                className={`usa-form-group ${
                  validationErrors.petitionFile ? 'usa-form-group--error' : ''
                }`}
              >
                <label
                  className={
                    'usa-label ustc-upload-petition with-hint ' +
                    (startCaseHelper.showPetitionFileValid ? 'validated' : '')
                  }
                  htmlFor="petition-file"
                  id="petition-file-label"
                >
                  Upload your petition{' '}
                  <span className="success-message">
                    <FontAwesomeIcon icon="check-circle" size="1x" />
                  </span>
                </label>
                <span className="usa-hint">
                  File must be in PDF format (.pdf). Max file size{' '}
                  {constants.MAX_FILE_SIZE_MB}MB.
                </span>
                <StateDrivenFileInput
                  aria-describedby="petition-file-label"
                  id="petition-file"
                  name="petitionFile"
                  updateFormValueSequence="updateStartCaseFormValueSequence"
                  validationSequence="validateStartCaseWizardSequence"
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
            </div>
          </div>
        </div>

        <h2 className="margin-top-4">Why are you filing this petition?</h2>
        <div className="blue-container">
          <div className="usa-form-group">
            <fieldset
              className={
                'usa-fieldset ' +
                (validationErrors.hasIrsNotice ? 'usa-form-group--error' : '')
              }
              id="irs-notice-radios"
            >
              <legend className="usa-legend" id="notice-legend">
                {startCaseHelper.noticeLegend}
              </legend>
              <div className="usa-form-group">
                {['Yes', 'No'].map((option, idx) => (
                  <div className="usa-radio usa-radio__inline" key={option}>
                    <input
                      aria-describedby="notice-legend"
                      checked={form.hasIrsNotice === (option === 'Yes')}
                      className="usa-radio__input"
                      id={`hasIrsNotice-${option}`}
                      name="hasIrsNotice"
                      type="radio"
                      value={option === 'Yes'}
                      onChange={e => {
                        updateStartCaseFormValueSequence({
                          key: e.target.name,
                          value: e.target.value === 'true',
                        });
                        validateStartCaseWizardSequence();
                      }}
                    />
                    <label
                      className="usa-radio__label"
                      htmlFor={`hasIrsNotice-${option}`}
                      id={`hasIrsNotice-${idx}`}
                    >
                      {option}
                    </label>
                  </div>
                ))}
                <Text
                  bind="validationErrors.hasIrsNotice"
                  className="usa-error-message"
                />
              </div>
            </fieldset>

            {startCaseHelper.showHasIrsNoticeOptions && (
              <CaseTypeSelect
                allowDefaultOption={true}
                caseTypes={caseTypeDescriptionHelper.caseTypes}
                legend="Type of Notice / Case"
                validation="validateStartCaseWizardSequence"
                value={form.caseType}
                onChange="updateFormValueSequence"
              />
            )}
            {startCaseHelper.showNotHasIrsNoticeOptions && (
              <CaseTypeSelect
                allowDefaultOption={true}
                caseTypes={caseTypeDescriptionHelper.caseTypes}
                legend="Which topic most closely matches your complaint with the
                IRS?"
                validation="validateStartCaseWizardSequence"
                value={form.caseType}
                onChange="updateFormValueSequence"
              />
            )}
          </div>
        </div>

        <div className="button-box-container">
          <button
            className="usa-button margin-right-205 margin-bottom-4"
            id="submit-case"
            type="button"
            onClick={() => {
              completeStartCaseWizardStepSequence({ nextStep: 3 });
            }}
          >
            Continue to Step 3 of 5
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
      </>
    );
  },
);
