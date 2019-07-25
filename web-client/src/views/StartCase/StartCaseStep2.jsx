import { CaseTypeSelect } from './CaseTypeSelect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Hint } from '../../ustc-ui/Hint/Hint';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { limitFileSize } from '../limitFileSize';
import { sequences, state } from 'cerebral';
import React from 'react';

export const StartCaseStep2 = connect(
  {
    caseTypeDescriptionHelper: state.caseTypeDescriptionHelper,
    completeStartCaseWizardStepSequence:
      sequences.completeStartCaseWizardStepSequence,
    constants: state.constants,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    startCaseHelper: state.startCaseHelper,
    updateHasIrsNoticeFormValueSequence:
      sequences.updateHasIrsNoticeFormValueSequence,
    updatePetitionValueSequence: sequences.updatePetitionValueSequence,
    updateStartCaseFormValueSequence:
      sequences.updateStartCaseFormValueSequence,
    validationErrors: state.validationErrors,
  },
  ({
    caseTypeDescriptionHelper,
    completeStartCaseWizardStepSequence,
    constants,
    formCancelToggleCancelSequence,
    startCaseHelper,
    updateHasIrsNoticeFormValueSequence,
    updatePetitionValueSequence,
    validateStartCaseSequence,
    validationErrors,
  }) => {
    return (
      <>
        <h1 className="margin-top-5"> 2. Tell Us About Your Petition </h1>
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
                >
                  Upload Your Petition{' '}
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
                      validateStartCaseSequence();
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
              <legend className="usa-legend">
                {startCaseHelper.noticeLegend}
              </legend>
              <div className="usa-form-group">
                {['Yes', 'No'].map((hasIrsNotice, idx) => (
                  <div
                    className="usa-radio usa-radio__inline"
                    key={hasIrsNotice}
                  >
                    <input
                      className="usa-radio__input"
                      id={`hasIrsNotice-${hasIrsNotice}`}
                      name="hasIrsNotice"
                      type="radio"
                      value={hasIrsNotice === 'Yes'}
                      onChange={e => {
                        updateHasIrsNoticeFormValueSequence({
                          key: e.target.name,
                          value: e.target.value === 'true',
                        });
                        validateStartCaseSequence();
                      }}
                    />
                    <label
                      className="usa-radio__label"
                      htmlFor={`hasIrsNotice-${hasIrsNotice}`}
                      id={`hasIrsNotice-${idx}`}
                    >
                      {hasIrsNotice}
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
                validation="validateStartCaseSequence"
                onChange="updateFormValueSequence"
              />
            )}
            {startCaseHelper.showNotHasIrsNoticeOptions && (
              <CaseTypeSelect
                allowDefaultOption={true}
                caseTypes={caseTypeDescriptionHelper.caseTypes}
                legend="Which topic most closely matches your complaint with the
                IRS?"
                validation="validateStartCaseSequence"
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
