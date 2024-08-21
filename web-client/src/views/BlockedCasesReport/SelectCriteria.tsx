import { TrialCityOptions } from '../TrialCityOptions';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const SelectCriteria = connect(
  {
    blockedCaseReportFilter: state.blockedCaseReportFilter,
    form: state.form,
    getBlockedCasesByTrialLocationSequence:
      sequences.getBlockedCasesByTrialLocationSequence,
    selectCriteriaHelper: state.selectCriteriaHelper,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  function SelectCriteria({
    blockedCaseReportFilter,
    form,
    getBlockedCasesByTrialLocationSequence,
    selectCriteriaHelper,
    updateFormValueSequence,
  }) {
    return (
      <>
        <div className="header-with-blue-background">
          <h3>Select criteria</h3>
        </div>
        <div className="blue-container">
          <div className="usa-form-group margin-bottom-3">
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
          <div className="usa-form-group margin-bottom-2">
            <label className="usa-label" htmlFor="procedure-type">
              Case type
            </label>
            <select
              className="usa-select"
              disabled={!form.trialLocation}
              id="procedure-type"
              name="procedureType"
              value={form.procedureType}
              onChange={e => {
                updateFormValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            >
              <option value="All">All</option>
              <option value="Small">Small</option>
              <option value="Regular">Regular</option>
            </select>
          </div>
          <div className="usa-form-group margin-bottom-0">
            <label className="usa-label" htmlFor="procedure-type">
              Case Status
            </label>
            <select
              className="usa-select"
              disabled={!form.trialLocation}
              id="case-status"
              name="caseStatusFilter"
              value={blockedCaseReportFilter.caseStatusFilter}
              onChange={e => {
                updateFormValueSequence({
                  key: e.target.name,
                  root: 'blockedCaseReportFilter',
                  value: e.target.value,
                });
              }}
            >
              <option value="All">All</option>
              {selectCriteriaHelper.caseStatuses.map(({ key, value }) => {
                return (
                  <option key={key} value={value}>
                    {value}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </>
    );
  },
);

SelectCriteria.displayName = 'SelectCriteria';
