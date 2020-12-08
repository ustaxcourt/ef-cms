import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { Hint } from '../../ustc-ui/Hint/Hint';
import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SetForHearingModal = connect(
  {
    addToTrialSessionModalHelper: state.addToTrialSessionModalHelper,
    cancelSequence: sequences.clearModalSequence,
    confirmSequence: sequences.setForHearingSequence,
    modal: state.modal,
    updateModalValueSequence: sequences.updateModalValueSequence,
    validateSetForHearingSequence: sequences.validateSetForHearingSequence,
    validationErrors: state.validationErrors,
  },
  function SetForHearingModal({
    addToTrialSessionModalHelper,
    cancelSequence,
    confirmSequence,
    modal,
    updateModalValueSequence,
    validateSetForHearingSequence,
    validationErrors,
  }) {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        className=""
        confirmLabel="Add Case"
        confirmSequence={confirmSequence}
        title="Set For Hearing"
      >
        <div className="margin-bottom-4" id="set-for-hearing-modal">
          <div className="usa-form-group">
            <fieldset className="usa-fieldset margin-bottom-0">
              <legend className="display-block" id="year-filed-legend">
                Trial locations
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
                  Requested city only
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
                  All locations
                </label>
              </div>
            </fieldset>
          </div>

          <FormGroup errorText={validationErrors.trialSessionId}>
            <label className="usa-label" htmlFor="trial-session">
              Select trial session
            </label>
            <BindedSelect
              bind="modal.trialSessionId"
              id="trial-session"
              name="trialSessionId"
              onChange={() => {
                validateSetForHearingSequence();
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
          <FormGroup errorText={validationErrors.note}>
            <fieldset className="usa-fieldset margin-bottom-0">
              <legend className="display-block" id="note-legend">
                Add note
              </legend>
              <textarea
                aria-label="set for hearing note"
                className="usa-textarea"
                id="note"
                maxLength="200"
                name="note"
                type="text"
                value={modal.note}
                onChange={e => {
                  updateModalValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                  validateSetForHearingSequence();
                }}
              />
            </fieldset>
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
