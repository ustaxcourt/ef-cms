import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { BindedTextarea } from '../../ustc-ui/BindedTextarea/BindedTextarea';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { Hint } from '../../ustc-ui/Hint/Hint';
import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const AddToTrialModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    modal: state.modal,
    updateModalValueSequence: sequences.updateModalValueSequence,
    validationErrors: state.validationErrors,
  },
  function AddToTrialModal({
    cancelSequence,
    confirmSequence,
    isNoteRequired = false,
    modal,
    modalHelper,
    modalTitle,
    updateModalValueSequence,
    validateSequence,
    validationErrors,
  }) {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        confirmLabel="Add Case"
        confirmSequence={confirmSequence}
        title={modalTitle}
      >
        <div className="margin-bottom-4" id="add-to-trial-session-modal">
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
                validateSequence();
              }}
            >
              <option value="">- Select -</option>
              {!modal.showAllLocations &&
                modalHelper.trialSessionsFormatted.map(trialSession => (
                  <option
                    key={trialSession.trialSessionId}
                    value={trialSession.trialSessionId}
                  >
                    {trialSession.optionText}
                  </option>
                ))}
              {modal.showAllLocations &&
                modalHelper.trialSessionStatesSorted.map(stateName => (
                  <optgroup key={stateName} label={stateName}>
                    {modalHelper.trialSessionsFormattedByState[stateName].map(
                      trialSession => (
                        <option
                          key={trialSession.trialSessionId}
                          value={trialSession.trialSessionId}
                        >
                          {trialSession.optionText}
                        </option>
                      ),
                    )}
                  </optgroup>
                ))}
            </BindedSelect>
          </FormGroup>

          {modalHelper.showSessionNotSetAlert && (
            <Hint>
              This trial session has not been set. This case will be added to
              the eligible cases for this session and prioritized when the
              calendar is set.{' '}
            </Hint>
          )}

          <FormGroup errorText={validationErrors.calendarNotes}>
            <label className="usa-label" htmlFor="trial-session-note">
              Add note{' '}
              {!isNoteRequired && <span className="usa-hint">(optional)</span>}
            </label>
            <BindedTextarea
              bind="modal.calendarNotes"
              id="trial-session-note"
              name="calendarNotes"
              required={isNoteRequired}
              onChange={() => {
                validateSequence();
              }}
            ></BindedTextarea>
          </FormGroup>
        </div>
      </ModalDialog>
    );
  },
);
