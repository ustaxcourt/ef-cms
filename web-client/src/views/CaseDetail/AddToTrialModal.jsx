import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { ModalDialog } from '../ModalDialog';
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
      caseDetailHelper,
      modal,
      updateModalValueSequence,
      validateAddToTrialSequence,
      validationErrors,
    } = this.props;

    return (
      <div className="margin-bottom-4">
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
            {caseDetailHelper.trialSessionsFormatted.map(trialSession => (
              <option
                key={trialSession.trialSessionId}
                value={trialSession.trialSessionId}
              >
                {trialSession.optionText}
              </option>
            ))}
          </BindedSelect>
        </div>
      </div>
    );
  }
}

export const AddToTrialModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    caseDetailHelper: state.caseDetailHelper,
    confirmSequence: sequences.addToTrialSequence,
    modal: state.modal,
    updateModalValueSequence: sequences.updateModalValueSequence,
    validateAddToTrialSequence: sequences.validateAddToTrialSequence,
    validationErrors: state.validationErrors,
  },
  AddToTrialModalComponent,
);
