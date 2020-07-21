import { Button } from '../../ustc-ui/Button/Button';
import { CaseTypeSelect } from './CaseTypeSelect';
import { Focus } from '../../ustc-ui/Focus/Focus';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { Hint } from '../../ustc-ui/Hint/Hint';
import { StateDrivenFileInput } from '../FileDocument/StateDrivenFileInput';
import { ValidationText } from '../../ustc-ui/Text/ValidationText';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const StartCaseStep2 = connect(
  {
    caseTypeDescriptionHelper: state.caseTypeDescriptionHelper,
    completeStartCaseWizardStepSequence:
      sequences.completeStartCaseWizardStepSequence,
    constants: state.constants,
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    navigateBackSequence: sequences.navigateBackSequence,
    startCaseHelper: state.startCaseHelper,
    updateStartCaseFormValueSequence:
      sequences.updateStartCaseFormValueSequence,
    validateStartCaseWizardSequence: sequences.validateStartCaseWizardSequence,
    validationErrors: state.validationErrors,
  },
  function StartCaseStep2({
    caseTypeDescriptionHelper,
    completeStartCaseWizardStepSequence,
    constants,
    form,
    formCancelToggleCancelSequence,
    navigateBackSequence,
    startCaseHelper,
    updateStartCaseFormValueSequence,
    validateStartCaseWizardSequence,
    validationErrors,
  }) {
    return (
      <>
        <Focus>
          <h2 className="focusable margin-bottom-105" tabIndex="-1">
            2. Your Petition
          </h2>
        </Focus>
        <Hint>
          Don’t forget to remove or redact your personal information on all your
          documents, including any IRS notice(s).
        </Hint>
        <p className="margin-bottom-3 margin-top-0 required-statement">
          *All fields required unless otherwise noted
        </p>
        <div className="blue-container grid-container padding-x-0">
          <div className="grid-row grid-gap">
            <div className="mobile-lg:grid-col-6">
              <FormGroup
                className={classNames(
                  (validationErrors.petitionFile ||
                    validationErrors.petitionFileSize) &&
                    'usa-form-group--error',
                )}
              >
                <label
                  className={classNames(
                    'usa-label ustc-upload-petition with-hint',
                    startCaseHelper.showPetitionFileValid && 'validated',
                  )}
                  htmlFor="petition-file"
                  id="petition-file-label"
                >
                  Upload your Petition
                </label>
                <span className="usa-hint">
                  File must be in PDF format (.pdf). Max file size{' '}
                  {constants.MAX_FILE_SIZE_MB}MB.
                </span>
                <div className="margin-top-0">
                  <Button
                    link
                    className="usa-link--external text-left mobile-text-wrap"
                    href="https://www.ustaxcourt.gov/forms/Petition_Simplified_Form_2.pdf"
                    icon="file-pdf"
                    iconColor="blue"
                    overrideMargin="margin-right-1"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Download Petition form (T.C. Form 2)
                  </Button>
                  <p className="margin-top-0">if you haven’t already done so</p>
                </div>
                <StateDrivenFileInput
                  aria-describedby="petition-file-label"
                  id="petition-file"
                  name="petitionFile"
                  updateFormValueSequence="updateStartCaseFormValueSequence"
                  validationSequence="validateStartCaseWizardSequence"
                />
                <ValidationText field="petitionFile" />
              </FormGroup>
            </div>
          </div>
        </div>

        <h3 className="margin-top-4">Why Are You Filing This Petition?</h3>
        <div className="blue-container margin-bottom-5">
          <div className="usa-form-group">
            <FormGroup
              className={classNames(
                validationErrors.hasIrsNotice && 'usa-form-group--error',
              )}
            >
              <fieldset className="usa-fieldset" id="irs-notice-radios">
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
                </div>
              </fieldset>
              <ValidationText field="hasIrsNotice" />
            </FormGroup>
            {startCaseHelper.showHasIrsNoticeOptions && (
              <CaseTypeSelect
                allowDefaultOption={true}
                caseTypes={caseTypeDescriptionHelper.caseTypes}
                className="margin-bottom-0"
                legend="Type of notice / case"
                validation="validateStartCaseWizardSequence"
                value={form.caseType}
                onChange="updateFormValueSequence"
              />
            )}
            {startCaseHelper.showNotHasIrsNoticeOptions && (
              <CaseTypeSelect
                allowDefaultOption={true}
                caseTypes={caseTypeDescriptionHelper.caseTypes}
                className="margin-bottom-0"
                legend="Which topic most closely matches your complaint with the
                IRS?"
                validation="validateStartCaseWizardSequence"
                value={form.caseType}
                onChange="updateFormValueSequence"
              />
            )}
          </div>
        </div>

        <Button
          id="submit-case"
          onClick={() => {
            completeStartCaseWizardStepSequence({ nextStep: 3 });
          }}
        >
          Continue to Step 3 of 5
        </Button>
        <Button secondary onClick={() => navigateBackSequence()}>
          Back
        </Button>
        <Button
          link
          onClick={() => {
            formCancelToggleCancelSequence();
          }}
        >
          Cancel
        </Button>
      </>
    );
  },
);
