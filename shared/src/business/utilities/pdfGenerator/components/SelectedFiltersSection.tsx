import React from 'react';

export const SelectedFiltersSection = ({ count, selectedFilters, trialStatusCounts }) => {  
  return(
  <div className="card margin-top-0">
    <div className="card-header filters-selected-header">
      <div>Trial Status Filters Selected</div>
      <div className="align-right">Total Shown: {count}</div>
    </div>
    <div className="filters-selected-content">
      <div className="filters-row">
        {[0, 2, 4, 6, 8].map(index => (
          <div key={index} className="filter">
            {selectedFilters[index]?.label || ''}
            {selectedFilters[index]?.key in trialStatusCounts && (
              <strong>({trialStatusCounts[selectedFilters[index].key]})</strong>
            )}
          </div>
        ))}
      </div>
      <div className="filters-row">
        {[1, 3, 5, 7, 9].map(index => (
          <div key={index} className="filter">
            {selectedFilters[index]?.label || ''}
            {selectedFilters[index]?.key in trialStatusCounts && (
              <strong>({trialStatusCounts[selectedFilters[index].key]})</strong>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
  )
};
