import React, { useRef } from 'react';
import classNames from 'classnames';

export const TableFilters = ({ filters, onSelect }) => {
  return (
    <div className="grid-row margin-bottom-3">
      <div className="grid-row grid-col-10">
        <div className="grid-col-1 padding-top-05 margin-right-3">
          <h3 id="filterHeading">Filter by</h3>
        </div>
        <div className="grid-row grid-col-10 grid-gap padding-left-2">
          {filters.map(({ isSelected, key, label, options }) => {
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
              <div className="grid-col-3" key={key}>
                <select
                  aria-label={key}
                  bind={`screenMetadata.${key}`}
                  className={classNames(
                    'usa-select',
                    isSelected && 'filter-selected',
                  )}
                  id={`${key}Filter`}
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
