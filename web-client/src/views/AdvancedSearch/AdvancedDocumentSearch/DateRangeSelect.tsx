import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const DateRangeSelect = connect(
  {
    DATE_RANGE_SEARCH_OPTIONS: state.constants.DATE_RANGE_SEARCH_OPTIONS,
    searchValue: props.searchValue,
    updateSequence: props.updateSequence,
    validateSequence: props.validateSequence,
  },
  function DateRangeSelect({
    DATE_RANGE_SEARCH_OPTIONS,
    searchValue,
    updateSequence,
    validateSequence,
  }) {
    return (
      <>
        <label className="usa-label" htmlFor="date-range">
          Date range
        </label>
        <select
          className="usa-select"
          id="date-range"
          name="dateRange"
          value={searchValue}
          onChange={e => {
            updateSequence({
              key: e.target.name,
              value: e.target.value,
            });
            validateSequence();
          }}
        >
          <option value={DATE_RANGE_SEARCH_OPTIONS.ALL_DATES}>All dates</option>
          <option value={DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES}>
            Custom dates
          </option>
        </select>
      </>
    );
  },
);

DateRangeSelect.displayName = 'DateRangeSelect';
