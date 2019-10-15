import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { TrialCityOptions } from '../TrialCityOptions';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const SelectCriteria = connect(
  {
    getBlockedCasesByTrialLocationSequence:
      sequences.getBlockedCasesByTrialLocationSequence,
  },
  ({ getBlockedCasesByTrialLocationSequence }) => (
    <>
      <div className="header-with-blue-background">
        <h3>Select Criteria</h3>
      </div>
      <div className="blue-container">
        <BindedSelect
          bind="form.trialLocation"
          id="trial-location"
          name="trialLocation"
          onChange={() => {
            getBlockedCasesByTrialLocationSequence();
          }}
        >
          <option value="">-- Select --</option>
          <TrialCityOptions />
        </BindedSelect>
      </div>
    </>
  ),
);
