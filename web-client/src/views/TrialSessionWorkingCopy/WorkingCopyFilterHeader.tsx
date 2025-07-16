import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const WorkingCopyFilterHeader = connect(
  {
    autoSaveTrialSessionWorkingCopySequence:
      sequences.autoSaveTrialSessionWorkingCopySequence,
    filters: state.trialSessionWorkingCopy.filters,
    trialSessionWorkingCopyHelper: state.trialSessionWorkingCopyHelper,
    trialStatusFilters: state.trialSessionWorkingCopyHelper.trialStatusFilters,
  },
  function WorkingCopyFilterHeader({
    autoSaveTrialSessionWorkingCopySequence,
    filters = {},
    trialSessionWorkingCopyHelper,
    trialStatusFilters,
  }) {
    return (
      <div className="working-copy-filters">
        <div className="working-copy-filters--header header-with-blue-background">
          <div className="grid-row">
            <div className="grid-col-6">
              <h3>Show Cases by Trial Status</h3>
            </div>
            <div className="grid-col-6 text-right">
              <span>
                Total Shown: {trialSessionWorkingCopyHelper.casesShownCount}
              </span>
            </div>
          </div>
        </div>

        <div className="working-copy-filters--content">
          <div className="grid-row">
            <div className="grid-col-1 show-all-sessions">
              <div className="usa-checkbox">
                <input
                  checked={!!filters.showAll}
                  className="usa-checkbox__input"
                  id="filters.showAll"
                  name="filters.showAll"
                  type="checkbox"
                  onChange={e => {
                    autoSaveTrialSessionWorkingCopySequence({
                      key: e.target.name,
                      value: e.target.checked,
                    });
                  }}
                />
                <label
                  className="usa-checkbox__label"
                  htmlFor="filters.showAll"
                >
                  Show All
                </label>
              </div>
            </div>
            {statusFilterComponent(trialStatusFilters, filters)}
          </div>
        </div>
      </div>
    );
  },
);

const statusFilterComponent = (trialStatusFilters, filters) => {
  const filterCheckboxes = [];

  for (let i = 0; i < trialStatusFilters.length; i += 2) {
    const filterColumn = (
      <div className={i === 0 ? 'grid-col-2 grid-offset-1' : 'grid-col-2'}>
        <FilterCheckbox
          filters={filters}
          i={i}
          trialStatusFilters={trialStatusFilters}
        />
        <FilterCheckbox
          filters={filters}
          i={i + 1}
          trialStatusFilters={trialStatusFilters}
        />
      </div>
    );

    filterCheckboxes.push(filterColumn);
  }
  return filterCheckboxes;
};

const FilterCheckbox = connect(
  {
    autoSaveTrialSessionWorkingCopySequence:
      sequences.autoSaveTrialSessionWorkingCopySequence,
  },
  function filterCheckbox({
    autoSaveTrialSessionWorkingCopySequence,
    filters,
    i,
    trialStatusFilters,
  }) {
    if (trialStatusFilters[i]) {
      return (
        <div className="usa-checkbox">
          <input
            checked={!!filters[trialStatusFilters[i].key]}
            className="usa-checkbox__input"
            id={`filters.${trialStatusFilters[i].key}`}
            name={`filters.${trialStatusFilters[i].key}`}
            type="checkbox"
            onChange={e => {
              autoSaveTrialSessionWorkingCopySequence({
                key: e.target.name,
                value: e.target.checked,
              });
            }}
          />
          <label
            className="usa-checkbox__label"
            htmlFor={`filters.${trialStatusFilters[i].key}`}
          >
            {trialStatusFilters[i].label}
          </label>
        </div>
      );
    }
  },
);

WorkingCopyFilterHeader.displayName = 'WorkingCopyFilterHeader';
