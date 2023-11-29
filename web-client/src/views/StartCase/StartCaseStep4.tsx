import { Button } from '../../ustc-ui/Button/Button';
import { CaseDifferenceExplained } from '../CaseDifferenceExplained';
import { CaseDifferenceModalOverlay } from './CaseDifferenceModalOverlay';
import { Focus } from '../../ustc-ui/Focus/Focus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { ProcedureType } from './ProcedureType';
import { TrialCity } from './TrialCity';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const StartCaseStep4 = connect(
  {
    clearPreferredTrialCitySequence: sequences.clearPreferredTrialCitySequence,
    completeStartCaseWizardStepSequence:
      sequences.completeStartCaseWizardStepSequence,
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    navigateBackSequence: sequences.navigateBackSequence,
    openCaseDifferenceModalSequence: sequences.openCaseDifferenceModalSequence,
    screenMetadata: state.screenMetadata,
    showModal: state.modal.showModal,
    startCaseHelper: state.startCaseHelper,
    toggleCaseDifferenceSequence: sequences.toggleCaseDifferenceSequence,
    trialCitiesHelper: state.trialCitiesHelper,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateStartCaseWizardSequence: sequences.validateStartCaseWizardSequence,
  },
  function StartCaseStep4({
    clearPreferredTrialCitySequence,
    completeStartCaseWizardStepSequence,
    form,
    formCancelToggleCancelSequence,
    navigateBackSequence,
    openCaseDifferenceModalSequence,
    screenMetadata,
    showModal,
    startCaseHelper,
    toggleCaseDifferenceSequence,
    updateFormValueSequence,
    validateStartCaseWizardSequence,
  }) {
    return (
      <>
        <Focus>
          <h2 className="focusable margin-bottom-105" tabIndex={-1}>
            4. What Case Procedure Should You Choose for Trial?
          </h2>
        </Focus>

        <p>
          If your case qualifies, you may choose to have it handled as a small
          tax case. The Court handles small tax cases differently.
        </p>
        <div className="usa-accordion start-a-case">
          <NonMobile>
            <button
              aria-controls="case-difference-container"
              aria-expanded={!!screenMetadata.showCaseDifference}
              className="usa-accordion__button case-difference"
              type="button"
              onClick={() => toggleCaseDifferenceSequence()}
            >
              <span className="usa-accordion__heading">
                <FontAwesomeIcon icon="question-circle" size="lg" />
                Which case procedure should I choose?
                {screenMetadata.showCaseDifference ? (
                  <FontAwesomeIcon icon="caret-up" />
                ) : (
                  <FontAwesomeIcon icon="caret-down" />
                )}
              </span>
            </button>
          </NonMobile>

          <Mobile>
            <button
              aria-controls="case-difference-container"
              aria-expanded={!!screenMetadata.showCaseDifference}
              className="usa-accordion__button case-difference"
              type="button"
              onClick={() => openCaseDifferenceModalSequence()}
            >
              <span className="usa-accordion__heading">
                <FontAwesomeIcon icon="question-circle" size="lg" />
                Which case procedure should I choose?
              </span>
            </button>
          </Mobile>

          <div
            aria-hidden={!screenMetadata.showCaseDifference}
            className="usa-accordion__content"
            hidden={!screenMetadata.showCaseDifference}
            id="case-difference-container"
          >
            <CaseDifferenceExplained />
          </div>
        </div>
        <p className="margin-bottom-3 margin-top-0 required-statement">
          *All fields required unless otherwise noted
        </p>
        <div className="blue-container">
          <ProcedureType
            legend="Select case procedure"
            value={form.procedureType}
            onChange={e => {
              updateFormValueSequence({
                key: 'procedureType',
                value: e.target.value,
              });
              clearPreferredTrialCitySequence();
              validateStartCaseWizardSequence();
            }}
          />
        </div>

        {startCaseHelper.showSelectTrial && (
          <>
            <h3 className="margin-top-4">U.S. Tax Court Trial Locations</h3>
            <p>
              This is the place your case will be heard if it goes to trial.
            </p>
            <div className="blue-container">
              <TrialCity
                label="Select a preferred trial location"
                procedureType={form.procedureType}
                showDefaultOption={true}
                showHint={true}
                showRegularTrialCitiesHint={
                  startCaseHelper.showRegularTrialCitiesHint
                }
                showSmallTrialCitiesHint={
                  startCaseHelper.showSmallTrialCitiesHint
                }
                value={form.preferredTrialCity || ''}
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value || null,
                  });
                  validateStartCaseWizardSequence();
                }}
              />
            </div>
          </>
        )}

        <div className="margin-top-5">
          <Button
            data-testid="complete-step-4"
            id="submit-case"
            onClick={() => {
              completeStartCaseWizardStepSequence({
                nextStep: 5,
              });
            }}
          >
            Continue to Step 5 of 5
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
        </div>
        {showModal === 'CaseDifferenceModalOverlay' && (
          <CaseDifferenceModalOverlay />
        )}
      </>
    );
  },
);

StartCaseStep4.displayName = 'StartCaseStep4';
