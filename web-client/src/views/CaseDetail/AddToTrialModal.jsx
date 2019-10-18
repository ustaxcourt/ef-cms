import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { ModalDialog } from '../ModalDialog';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

class AddToTrialModalComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.modal = {
      cancelLabel: 'Cancel',
      classNames: '',
      confirmLabel: 'Add case',
      title: 'Add to Trial Session',
    };
  }

  renderBody() {
    const {
      addToTrialSessionModalHelper,
      modal,
      updateModalValueSequence,
      validateAddToTrialSequence,
      validationErrors,
    } = this.props;

    return (
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

        <div
          className={classNames(
            'usa-form-group margin-bottom-0',
            validationErrors.trialSessionId && 'usa-form-group--error',
          )}
        >
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
          <Text
            bind="validationErrors.trialSessionId"
            className="usa-error-message"
          />
        </div>
      </div>
    );
  }
}

export const AddToTrialModal = connect(
  {
    addToTrialSessionModalHelper: state.addToTrialSessionModalHelper,
    cancelSequence: sequences.clearModalSequence,
    confirmSequence: sequences.addToTrialSessionSequence,
    modal: state.modal,
    updateModalValueSequence: sequences.updateModalValueSequence,
    validateAddToTrialSequence: sequences.validateAddToTrialSessionSequence,
    validationErrors: state.validationErrors,
  },
  AddToTrialModalComponent,
);
