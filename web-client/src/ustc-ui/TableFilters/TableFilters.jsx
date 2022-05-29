import React from 'react';

export const TableFilters = ({ filters, onSelect }) => {
  return (
    <div className="grid-row margin-bottom-3">
      <div className="grid-row grid-col-10">
        <div className="grid-col-1 padding-top-05 margin-right-3">
          <h3 id="filterHeading">Filter by</h3>
        </div>
        <div className="grid-row grid-col-10 grid-gap padding-left-2">
          {filters.map(({ key, label, options }) => {
            return (
              <div className="grid-col-3" key={key}>
                <select
                  aria-label={key}
                  bind={`screenMetadata.${key}`}
                  className="usa-select"
                  id={`${key}Filter`}
                  name={key}
                  value={filters[key]}
                  onChange={e => {
                    onSelect({
                      key,
                      value: e.target.value,
                    });
                  }}
                >
                  <option value="">-{label}-</option>
                  {options.map(from => (
                    <option key={from} value={from}>
                      {from}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
