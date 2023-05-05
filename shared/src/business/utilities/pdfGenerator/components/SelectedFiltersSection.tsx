import React from 'react';

export const SelectedFiltersSection = ({ count, selectedFilters }) => (
  <div className="card margin-top-0">
    <div className="card-header filters-selected-header">
      <div>Trial Status Filters Selected</div>
      <div className="align-right">Total Shown: {count}</div>
    </div>
    <div className="filters-selected-content">
      <div className="filters-row">
        <div className="filter">{selectedFilters[0]?.label || ''}</div>
        <div className="filter">{selectedFilters[2]?.label || ''}</div>
        <div className="filter">{selectedFilters[4]?.label || ''}</div>
        <div className="filter">{selectedFilters[6]?.label || ''}</div>
        <div className="filter">{selectedFilters[8]?.label || ''}</div>
      </div>
      <div className="filters-row">
        <div className="filter">{selectedFilters[1]?.label || ''}</div>
        <div className="filter">{selectedFilters[3]?.label || ''}</div>
        <div className="filter">{selectedFilters[5]?.label || ''}</div>
        <div className="filter">{selectedFilters[7]?.label || ''}</div>
        <div className="filter">{selectedFilters[9]?.label || ''}</div>
      </div>
    </div>
  </div>
);
