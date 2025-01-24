import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { ModalDialog } from './ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const TrialSessionPlanningModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    confirmSequence: sequences.navigateToTrialSessionPlanningReportSequence,
    modalInfo: state.modal,
    trialYears: state.modal.trialYears,
    updateModalValueSequence: sequences.updateModalValueSequence,
    validateTrialSessionPlanningSequence:
      sequences.validateTrialSessionPlanningSequence,
    validationErrors: state.validationErrors,
  },
  function TrialSessionPlanningModal({
    cancelSequence,
    confirmSequence,
    modalInfo,
    trialYears,
    updateModalValueSequence,
    validateTrialSessionPlanningSequence,
    validationErrors,
  }) {
    const { term, year: modalYear } = modalInfo;
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        className="trial-session-planning-modal"
        confirmLabel="Run Report"
        confirmSequence={() => confirmSequence({ term, year: modalYear })}
        title="Run Trial Session Planning Report"
      >
        <div className="margin-bottom-4">
          <FormGroup
            errorMessageId="trial-session-planning-report-modal-term-error"
            errorText={validationErrors.term}
          >
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
                data-testid="trial-session-planning-report-term-selector"
                name="term"
                onChange={e => {
                  updateModalValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                  validateTrialSessionPlanningSequence({
                    term: e.target.value,
                    year: modalYear,
                  });
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

          <FormGroup
            errorMessageId="trial-session-planning-report-modal-year-error"
            errorText={validationErrors.year}
          >
            <fieldset className="usa-fieldset margin-bottom-0">
              <legend className="display-block" id="trial-year">
                Select year
              </legend>
              <select
                aria-label="trial report year"
                className={classNames(
                  'usa-select',
                  validationErrors.year && 'usa-select--error',
                )}
                data-testid="trial-session-planning-report-year-selector"
                name="year"
                onChange={e => {
                  updateModalValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                  validateTrialSessionPlanningSequence({
                    term,
                    year: +e.target.value,
                  });
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

TrialSessionPlanningModal.displayName = 'TrialSessionPlanningModal';
