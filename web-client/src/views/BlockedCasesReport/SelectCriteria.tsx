import { TrialCityOptions } from '../TrialCityOptions';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const SelectCriteria = connect(
  {
    blockedCaseReportFilter: state.blockedCaseReportFilter,
    getBlockedCasesByTrialLocationSequence:
      sequences.getBlockedCasesByTrialLocationSequence,
    selectCriteriaHelper: state.selectCriteriaHelper,
    setBlockedCaseReportProcedureTypeSequence:
      sequences.setBlockedCaseReportProcedureTypeSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  function SelectCriteria({
    blockedCaseReportFilter,
    getBlockedCasesByTrialLocationSequence,
    selectCriteriaHelper,
    setBlockedCaseReportProcedureTypeSequence,
    updateFormValueSequence,
  }) {
    return (
      <>
        <div className="header-with-blue-background">
          <h3>Select criteria</h3>
        </div>
        <div className="blue-container">
          <div className="usa-form-group margin-bottom-2">
            <label className="usa-label" htmlFor="trial-location">
              Trial location
            </label>
            <select
              className="usa-select"
              data-testid="trial-location-filter"
              id="trial-location"
              name="trialLocationFilter"
              value={blockedCaseReportFilter.trialLocationFilter}
              onChange={e => {
                getBlockedCasesByTrialLocationSequence({
                  key: e.target.name,
                  root: 'blockedCaseReportFilter',
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
              data-testid="procedure-type-filter"
              disabled={!blockedCaseReportFilter.trialLocationFilter}
              id="procedure-type"
              name="procedureTypeFilter"
              value={blockedCaseReportFilter.procedureTypeFilter}
              onChange={e => {
                setBlockedCaseReportProcedureTypeSequence({
                  procedureType: e.target.value,
                });
              }}
            >
              <option value="All">All</option>
              {selectCriteriaHelper.procedureTypes.map(({ key, value }) => {
                return (
                  <option key={key} value={value}>
                    {value}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="usa-form-group margin-bottom-2">
            <label className="usa-label" htmlFor="case-status-type">
              Case status
            </label>
            <select
              className="usa-select"
              data-testid="case-status-filter"
              disabled={!blockedCaseReportFilter.trialLocationFilter}
              id="case-status-type"
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

          <div className="usa-form-group margin-bottom-0">
            <label className="usa-label" htmlFor="reason-type">
              Reason
            </label>
            <select
              className="usa-select"
              data-testid="blocked-reason-filter"
              disabled={!blockedCaseReportFilter.trialLocationFilter}
              id="reason-type"
              name="reasonFilter"
              value={blockedCaseReportFilter.reasonFilter}
              onChange={e => {
                updateFormValueSequence({
                  key: e.target.name,
                  root: 'blockedCaseReportFilter',
                  value: e.target.value,
                });
              }}
            >
              <option value="All">All</option>
              {selectCriteriaHelper.automaticBlockedReasons.map(
                ({ key, value }) => {
                  return (
                    <option key={key} value={value}>
                      {value}
                    </option>
                  );
                },
              )}
            </select>
          </div>
        </div>
      </>
    );
  },
);

SelectCriteria.displayName = 'SelectCriteria';
