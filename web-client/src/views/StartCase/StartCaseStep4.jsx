import { Button } from '../../ustc-ui/Button/Button';
import { CaseDifferenceExplained } from '../CaseDifferenceExplained';
import { CaseDifferenceModalOverlay } from './CaseDifferenceModalOverlay';
import { Focus } from '../../ustc-ui/Focus/Focus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { ProcedureType } from './ProcedureType';
import { TrialCity } from './TrialCity';
import { ValidationText } from '../../ustc-ui/Text/ValidationText';
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
    navigateBackSequence: sequences.navigateBackSequence,
    openCaseDifferenceModalSequence: sequences.openCaseDifferenceModalSequence,
    screenMetadata: state.screenMetadata,
    showModal: state.showModal,
    startCaseHelper: state.startCaseHelper,
    toggleCaseDifferenceSequence: sequences.toggleCaseDifferenceSequence,
    trialCitiesHelper: state.trialCitiesHelper,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateStartCaseWizardSequence: sequences.validateStartCaseWizardSequence,
  },
  ({
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
    trialCitiesHelper,
    updateFormValueSequence,
    validateStartCaseWizardSequence,
  }) => {
    return (
      <>
        <Focus>
          <h2 className="focusable" tabIndex="-1">
            4. How do you want this case handled?
          </h2>
        </Focus>
        <p className="required-statement margin-top-05 margin-bottom-2">
          *All fields required unless otherwise noted
        </p>
        <p>
          Tax laws allow you to file your case as a “small case,” which means
          it’s handled a bit differently than a regular case. If you choose to
          have your case processed as a small case, the Tax Court must approve
          your choice. Generally, the Tax Court will agree with your request if
          you qualify.
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
            id="case-difference-container"
          >
            <CaseDifferenceExplained />
          </div>
        </div>
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
            <h2 className="margin-top-4">U.S. Tax Court Trial Locations</h2>
            <p>
              If your case goes to trial, this is where it will be held. Keep in
              mind that the nearest location may not be in your state.
            </p>
            <div className="blue-container">
              <TrialCity
                label="Select a preferred trial location"
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
                  validateStartCaseWizardSequence();
                }}
              />
              <ValidationText field="preferredTrialCity" />
            </div>
          </>
        )}

        <div className="margin-top-5">
          <Button
            id="submit-case"
            onClick={() => {
              completeStartCaseWizardStepSequence({
                errorDisplayOrder: ['procedureType', 'preferredTrialCity'],
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
