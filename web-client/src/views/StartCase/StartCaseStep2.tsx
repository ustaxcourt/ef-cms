import { Button } from '../../ustc-ui/Button/Button';
import { CaseTypeSelect } from './CaseTypeSelect';
import { Focus } from '../../ustc-ui/Focus/Focus';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { Hint } from '../../ustc-ui/Hint/Hint';
import { StateDrivenFileInput } from '../FileDocument/StateDrivenFileInput';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
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
    updateFormValueSequence: sequences.updateFormValueSequence,
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
    updateFormValueSequence,
    validateStartCaseWizardSequence,
    validationErrors,
  }) {
    return (
      <>
        <Focus>
          <h2 className="focusable margin-bottom-105" tabIndex={-1}>
            2. Your Petition
          </h2>
        </Focus>
        <Hint>
          Don’t forget to remove or block out (redact) your personal information
          on all your documents, including any IRS notice(s).
        </Hint>
        <p className="margin-bottom-3 margin-top-0 required-statement">
          *All fields required unless otherwise noted
        </p>
        <div className="blue-container padding-x-0">
          <FormGroup
            errorText={
              validationErrors.petitionFile || validationErrors.petitionFileSize
            }
          >
            <label
              className={classNames(
                'usa-label ustc-upload-petition with-hint',
                startCaseHelper.showPetitionFileValid && 'validated',
              )}
              data-testid="petition-file-label"
              htmlFor="petition-file"
              id="petition-file-label"
            >
              Upload Petition PDF (.pdf)
            </label>
            <span className="usa-hint">
              Make sure file is not encrypted or password protected. Max file
              size {constants.MAX_FILE_SIZE_MB}MB.
            </span>
            <div className="margin-top-0">
              <Button
                link
                className="usa-link--external text-left mobile-text-wrap"
                href="https://www.ustaxcourt.gov/resources/forms/Petition_Simplified_Form_2.pdf"
                icon="file-pdf"
                iconColor="blue"
                overrideMargin="margin-right-1"
                rel="noopener noreferrer"
                target="_blank"
              >
                Download Petition form (T.C. Form 2)
              </Button>
              <p className="margin-top-05 usa-hint display-block">
                if you haven’t already done so
              </p>
            </div>
            <StateDrivenFileInput
              aria-describedby="petition-file-label"
              data-testid="petition-file"
              id="petition-file"
              name="petitionFile"
              updateFormValueSequence="updateStartCaseFormValueSequence"
              validationSequence="validateStartCaseWizardSequence"
            />
          </FormGroup>
        </div>

        <h3 className="margin-top-4">Why Are You Filing This Petition?</h3>
        <div className="blue-container margin-bottom-5">
          <div className="usa-form-group">
            <FormGroup errorText={validationErrors.hasIrsNotice}>
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
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value === 'true',
                          });
                          validateStartCaseWizardSequence();
                        }}
                      />
                      <label
                        className="usa-radio__label"
                        data-testid={`irs-notice-${option}`}
                        htmlFor={`hasIrsNotice-${option}`}
                        id={`hasIrsNotice-${idx}`}
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
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
          data-testid="complete-step-2"
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
StartCaseStep2.displayName = 'StartCaseStep2';
