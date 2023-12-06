import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const InPersonProceedingForm = connect(
  {
    form: state.form,
    updateTrialSessionFormDataSequence:
      sequences.updateTrialSessionFormDataSequence,
    usStates: state.constants.US_STATES,
    usStatesOther: state.constants.US_STATES_OTHER,
    validateTrialSessionSequence: sequences.validateTrialSessionSequence,
    validationErrors: state.validationErrors,
  },
  ({
    form,
    updateTrialSessionFormDataSequence,
    usStates,
    usStatesOther,
    validateTrialSessionSequence,
    validationErrors,
  }) => {
    return (
      <div>
        <div className="usa-form-group">
          <label className="usa-label" htmlFor="courthouse-name">
            Courthouse name <span className="usa-hint">(optional)</span>
          </label>
          <input
            autoCapitalize="none"
            className="usa-input"
            data-testid="courthouse-name"
            id="courthouse-name"
            name="courthouseName"
            type="text"
            value={form.courthouseName || ''}
            onChange={e => {
              updateTrialSessionFormDataSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
        </div>

        <div className="usa-form-group">
          <label className="usa-label" htmlFor="address1">
            Address line 1 <span className="usa-hint">(optional)</span>
          </label>
          <input
            autoCapitalize="none"
            className="usa-input"
            id="address1"
            name="address1"
            type="text"
            value={form.address1 || ''}
            onChange={e => {
              updateTrialSessionFormDataSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
        </div>

        <div className="usa-form-group">
          <label className="usa-label" htmlFor="address2">
            Address line 2 <span className="usa-hint">(optional)</span>
          </label>
          <input
            autoCapitalize="none"
            className="usa-input"
            id="address2"
            name="address2"
            type="text"
            value={form.address2 || ''}
            onChange={e => {
              updateTrialSessionFormDataSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
        </div>

        <div className="usa-form-group">
          <div className="grid-row grid-gap state-and-city">
            <div className="grid-col-8">
              <label className="usa-label" htmlFor="city">
                City <span className="usa-hint">(optional)</span>
              </label>
              <input
                autoCapitalize="none"
                className="usa-input usa-input--inline"
                data-testid="city"
                id="city"
                name="city"
                type="text"
                value={form.city || ''}
                onChange={e => {
                  updateTrialSessionFormDataSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </div>
            <div className="grid-col-4">
              <label className="usa-label" htmlFor="state">
                State <span className="usa-hint">(optional)</span>
              </label>
              <select
                className="usa-select"
                data-testid="state"
                id="state"
                name="state"
                value={form.state || ''}
                onChange={e => {
                  updateTrialSessionFormDataSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              >
                <option value="">- Select -</option>
                <optgroup label="State">
                  {Object.keys(usStates).map(abbrev => {
                    return (
                      <option key={abbrev} value={abbrev}>
                        {usStates[abbrev]}
                      </option>
                    );
                  })}
                </optgroup>
                <optgroup label="Other">
                  {Object.keys(usStatesOther).map(abbrev => {
                    return (
                      <option key={abbrev} value={abbrev}>
                        {usStatesOther[abbrev]}
                      </option>
                    );
                  })}
                </optgroup>
              </select>
            </div>
          </div>
        </div>
        <FormGroup errorText={validationErrors.postalCode}>
          <label aria-hidden className="usa-label" htmlFor="postal-code">
            ZIP code <span className="usa-hint">(optional)</span>
          </label>
          <input
            aria-label="zip code"
            autoCapitalize="none"
            className="usa-input max-width-200 usa-input--medium"
            data-testid="postal-code"
            id="postal-code"
            name="postalCode"
            type="text"
            value={form.postalCode || ''}
            onBlur={() => {
              validateTrialSessionSequence();
            }}
            onChange={e => {
              updateTrialSessionFormDataSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
        </FormGroup>
      </div>
    );
  },
);

InPersonProceedingForm.displayName = 'InPersonProceedingForm';
