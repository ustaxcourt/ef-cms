import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const TrialSessionPlanningModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    confirmSequence: sequences.runTrialSessionPlanningReportSequence,
    modal: state.modal,
    trialYears: state.modal.trialYears,
    updateModalValueSequence: sequences.updateModalValueSequence,
    validateTrialSessionPlanningSequence:
      sequences.validateTrialSessionPlanningSequence,
    validationErrors: state.validationErrors,
  },
  ({
    cancelSequence,
    confirmSequence,
    trialYears,
    updateModalValueSequence,
    validateTrialSessionPlanningSequence,
    validationErrors,
  }) => {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        className="trial-session-planning-modal"
        confirmLabel="Run report"
        confirmSequence={confirmSequence}
        title="Run Trial Session Planning Report"
      >
        <div className="margin-bottom-4">
          <FormGroup errorText={validationErrors.term}>
            <fieldset className="usa-fieldset margin-bottom-0">
              <legend className="display-block" id="trial-term">
                What trial term are you planning for?
              </legend>
              <select
                aria-label="trial report term"
                className={classNames(
                  'usa-select',
                  validationErrors.term && 'usa-select--error',
                )}
                name="term"
                onChange={e => {
                  updateModalValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                  validateTrialSessionPlanningSequence();
                }}
              >
                <option value="">- Select -</option>
                <option key="winter" value="winter">
                  Winter
                </option>
                <option key="spring" value="spring">
                  Spring
                </option>
                <option key="fall" value="fall">
                  Fall
                </option>
              </select>
            </fieldset>
          </FormGroup>

          <FormGroup errorText={validationErrors.year}>
            <fieldset className="usa-fieldset margin-bottom-0">
              <legend className="display-block" id="trial-year">
                Select Year
              </legend>
              <select
                aria-label="trial report year"
                className={classNames(
                  'usa-select',
                  validationErrors.year && 'usa-select--error',
                )}
                name="year"
                onChange={e => {
                  updateModalValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                  validateTrialSessionPlanningSequence();
                }}
              >
                <option value="">- Select -</option>
                {trialYears.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </fieldset>
          </FormGroup>
        </div>
      </ModalDialog>
    );
  },
);
