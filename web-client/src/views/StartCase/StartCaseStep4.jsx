import { CaseDifferenceExplained } from '../CaseDifferenceExplained';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ProcedureType } from './ProcedureType';
import { Text } from '../../ustc-ui/Text/Text';
import { TrialCity } from './TrialCity';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const StartCaseStep4 = connect(
  {
    clearPreferredTrialCitySequence: sequences.clearPreferredTrialCitySequence,
    completeStartCaseWizardStepSequence:
      sequences.completeStartCaseWizardStepSequence,
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    screenMetadata: state.screenMetadata,
    startCaseHelper: state.startCaseHelper,
    toggleCaseDifferenceSequence: sequences.toggleCaseDifferenceSequence,
    trialCitiesHelper: state.trialCitiesHelper,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateStartCaseSequence: sequences.validateStartCaseSequence,
    validationErrors: state.validationErrors,
  },
  ({
    clearPreferredTrialCitySequence,
    completeStartCaseWizardStepSequence,
    form,
    formCancelToggleCancelSequence,
    screenMetadata,
    startCaseHelper,
    toggleCaseDifferenceSequence,
    trialCitiesHelper,
    updateFormValueSequence,
    validateStartCaseSequence,
    validationErrors,
  }) => {
    return (
      <>
        <h1 className="margin-top-4">4. How do you want this case handled?</h1>
        <p className="required-statement margin-top-05 margin-bottom-2">
          All fields required unless otherwise noted
        </p>
        <p>
          Tax laws allow you to file your case as a “small case,” which means
          it’s handled a bit differently than a regular case. If you choose to
          have your case processed as a small case, the Tax Court must approve
          your choice. Generally, the Tax Court will agree with your request if
          you qualify.
        </p>
        <div className="usa-accordion start-a-case">
          <button
            aria-controls="case-difference-container"
            aria-expanded={!!screenMetadata.showCaseDifference}
            className="usa-accordion__button case-difference"
            type="button"
            onClick={() => toggleCaseDifferenceSequence()}
          >
            <span className="usa-accordion__heading usa-banner__button-text">
              <FontAwesomeIcon icon="question-circle" size="lg" />
              Which case procedure should I choose?
              {screenMetadata.showCaseDifference ? (
                <FontAwesomeIcon icon="caret-up" />
              ) : (
                <FontAwesomeIcon icon="caret-down" />
              )}
            </span>
          </button>
          <div
            aria-hidden={!screenMetadata.showCaseDifference}
            className="usa-accordion__content"
            id="case-difference-container"
          >
            <CaseDifferenceExplained />
          </div>
        </div>
        <div className="blue-container">
          <ProcedureType
            legend="Select Case Procedure"
            value={form.procedureType}
            onChange={e => {
              updateFormValueSequence({
                key: 'procedureType',
                value: e.target.value,
              });
              clearPreferredTrialCitySequence();
              validateStartCaseSequence();
            }}
          />
          {startCaseHelper.showSelectTrial && (
            <TrialCity
              label="Select a Trial Location"
              showDefaultOption={true}
              showHint={true}
              showRegularTrialCitiesHint={
                startCaseHelper.showRegularTrialCitiesHint
              }
              showSmallTrialCitiesHint={
                startCaseHelper.showSmallTrialCitiesHint
              }
              trialCitiesByState={
                trialCitiesHelper(form.procedureType).trialCitiesByState
              }
              value={form.preferredTrialCity}
              onChange={e => {
                updateFormValueSequence({
                  key: e.target.name,
                  value: e.target.value || null,
                });
                validateStartCaseSequence();
              }}
            />
          )}
          {!validationErrors.procedureType && (
            <Text
              bind="validationErrors.preferredTrialCity"
              className="usa-error-message"
            />
          )}
        </div>

        <div className="button-box-container">
          <button
            className="usa-button margin-right-205 margin-bottom-4"
            id="submit-case"
            type="button"
            onClick={() => {
              completeStartCaseWizardStepSequence({ nextStep: 5 });
            }}
          >
            Continue to Step 5 of 5
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
