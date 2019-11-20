import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { Hint } from '../../ustc-ui/Hint/Hint';
import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const AddToTrialModal = connect(
  {
    addToTrialSessionModalHelper: state.addToTrialSessionModalHelper,
    cancelSequence: sequences.clearModalSequence,
    confirmSequence: sequences.addCaseToTrialSessionSequence,
    modal: state.modal,
    updateModalValueSequence: sequences.updateModalValueSequence,
    validateAddToTrialSequence: sequences.validateAddToTrialSessionSequence,
    validationErrors: state.validationErrors,
  },
  ({
    addToTrialSessionModalHelper,
    cancelSequence,
    confirmSequence,
    modal,
    updateModalValueSequence,
    validateAddToTrialSequence,
    validationErrors,
  }) => {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        className=""
        confirmLabel="Add case"
        confirmSequence={confirmSequence}
        title="Add to Trial Session"
      >
        <div className="margin-bottom-4" id="add-to-trial-session-modal">
          <div className="usa-form-group">
            <fieldset className="usa-fieldset margin-bottom-0">
              <legend className="display-block" id="year-filed-legend">
                Trial Locations
              </legend>
              <div className="usa-radio usa-radio__inline">
                <input
                  checked={modal.showAllLocations === false}
                  className="usa-radio__input"
                  id="show-all-locations-false"
                  name="showAllLocations"
                  type="radio"
                  onChange={e => {
                    updateModalValueSequence({
                      key: e.target.name,
                      value: false,
                    });
                  }}
                />
                <label
                  className="usa-radio__label"
                  htmlFor="show-all-locations-false"
                >
                  Requested City Only
                </label>
              </div>
              <div className="usa-radio usa-radio__inline">
                <input
                  checked={modal.showAllLocations === true}
                  className="usa-radio__input"
                  id="show-all-locations-true"
                  name="showAllLocations"
                  type="radio"
                  onChange={e => {
                    updateModalValueSequence({
                      key: e.target.name,
                      value: true,
                    });
                  }}
                />
                <label
                  className="usa-radio__label"
                  htmlFor="show-all-locations-true"
                >
                  All Locations
                </label>
              </div>
            </fieldset>
          </div>

          <FormGroup errorText={validationErrors.trialSessionId}>
            <label className="usa-label" htmlFor="trial-session">
              Select Trial Session
            </label>
            <BindedSelect
              bind="modal.trialSessionId"
              id="trial-session"
              name="trialSessionId"
              onChange={() => {
                validateAddToTrialSequence();
              }}
            >
              <option value="">- Select -</option>
              {!modal.showAllLocations &&
                addToTrialSessionModalHelper.trialSessionsFormatted.map(
                  trialSession => (
                    <option
                      key={trialSession.trialSessionId}
                      value={trialSession.trialSessionId}
                    >
                      {trialSession.optionText}
                    </option>
                  ),
                )}
              {modal.showAllLocations &&
                addToTrialSessionModalHelper.trialSessionStatesSorted.map(
                  (stateName, idx) => (
                    <optgroup key={idx} label={stateName}>
                      {addToTrialSessionModalHelper.trialSessionsFormattedByState[
                        stateName
                      ].map(trialSession => (
                        <option
                          key={trialSession.trialSessionId}
                          value={trialSession.trialSessionId}
                        >
                          {trialSession.optionText}
                        </option>
                      ))}
                    </optgroup>
                  ),
                )}
            </BindedSelect>
          </FormGroup>
          {addToTrialSessionModalHelper.showSessionNotSetAlert && (
            <Hint>
              This trial session has not been set. This case will be added to
              the eligible cases for this session and prioritized when the
              calendar is set.{' '}
            </Hint>
          )}
        </div>
      </ModalDialog>
    );
  },
);
