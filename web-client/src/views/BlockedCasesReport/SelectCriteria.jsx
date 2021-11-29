import { TrialCityOptions } from '../TrialCityOptions';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SelectCriteria = connect(
  {
    form: state.form,
    getBlockedCasesByTrialLocationSequence:
      sequences.getBlockedCasesByTrialLocationSequence,
  },
  function SelectCriteria({ form, getBlockedCasesByTrialLocationSequence }) {
    return (
      <>
        <div className="header-with-blue-background">
          <h3>Select criteria</h3>
        </div>
        <div className="blue-container">
          <div className="usa-form-group margin-bottom-0">
            <label className="usa-label" htmlFor="trial-location">
              Trial location
            </label>
            <select
              className="usa-select"
              id="trial-location"
              name="trialLocation"
              value={form.trialLocation}
              onChange={e => {
                getBlockedCasesByTrialLocationSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            >
              <option value="">-- Select --</option>
              <TrialCityOptions procedureType="All" />
            </select>
          </div>
        </div>
      </>
    );
  },
);
