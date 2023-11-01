import React, { useRef } from 'react';
import classNames from 'classnames';

export const TableFilters = ({ filters, onSelect }) => {
  return (
    <div className="grid-row margin-bottom-4">
      <div className="padding-top-05">
        <label
          className="dropdown-label-serif margin-right-3"
          htmlFor="inline-select"
          id="table-filter-label"
        >
          Filter by
        </label>
      </div>
      <div>
        {filters.map(
          ({ isSelected, key, label, options, useInlineSelect = true }) => {
            // track the input element so we can manually reset the value
            const ref = useRef();

            const clearSelect = e => {
              e.preventDefault();
              onSelect({
                key,
                value: undefined,
              });
              // the select input is not resetting back (due to cerebral js state or react) not
              // correctly updating the dom, so we need to reset it manually
              ref.current.value = '';
            };

            return (
              <select
                aria-label={
                  isSelected ? 'reset filter' : `${label} filter drop down`
                }
                className={classNames(
                  'usa-select',
                  useInlineSelect && 'inline-select',
                  'width-180',
                  'select-left',
                  'margin-left-1pt5rem',
                  isSelected && 'filter-selected',
                )}
                id={`${key}Filter`}
                key={key}
                name={key}
                ref={ref}
                value={filters[key]}
                onChange={e => {
                  onSelect({
                    key,
                    value: e.target.value,
                  });
                }}
                onKeyDown={e => {
                  const ENTER = 13;
                  const SPACE = 32;
                  if (isSelected && [ENTER, SPACE].includes(e.keyCode)) {
                    clearSelect(e);
                  }
                }}
                onMouseDown={e => {
                  if (isSelected) {
                    clearSelect(e);
                  }
                }}
              >
                <option value="">-{label}-</option>
                {options.map(from => (
                  <option key={from} value={from}>
                    {from}
                  </option>
                ))}
              </select>
            );
          },
        )}
      </div>
    </div>
  );
};

TableFilters.displayName = 'TableFilters';
