const React = require('react');

export const SelectedFiltersSection = ({ count, selectedFilters }) => {
  return (
    <>
      <div className="card margin-top-0" id="notes">
        <div className="card-header filters-selected-header">
          <div>Trial Status Filters Selected</div>
          <div className="align-right">Total Shown: {count}</div>
        </div>
        <div className="filters-selected-content">
          {/* <div className="card-content filters-selected-content"> */}
          <div className="filters-row">
            <div className="filter">{selectedFilters[0] || ''}</div>
            <div className="filter">{selectedFilters[2] || ''}</div>
            <div className="filter">{selectedFilters[4] || ''}</div>
            <div className="filter">{selectedFilters[6] || ''}</div>
            <div className="filter">{selectedFilters[8] || ''}</div>
          </div>
          <div className="filters-row">
            <div className="filter">{selectedFilters[1] || ''}</div>
            <div className="filter">{selectedFilters[3] || ''}</div>
            <div className="filter">{selectedFilters[5] || ''}</div>
            <div className="filter">{selectedFilters[7] || ''}</div>
            <div className="filter">{''}</div>
          </div>
        </div>
      </div>
    </>
    // <>
    //   <div className="card margin-top-0" id="notes">
    //     <div className="card-header filters-selected-header">
    //       <div>Trial Status Filters Selected</div>
    //       <div className="align-right">Total Shown: {count}</div>
    //     </div>
    //     <div className="card-content filters-selected-content">
    //       <span className="filters-selected-column">
    //         <div className="filters">
    //           <div className="filter">{selectedFilters[0] || ''}</div>
    //           <div className="filter">{selectedFilters[1] || ''}</div>
    //         </div>
    //       </span>
    //       <span className="filters-selected-column">
    //         <div className="filters">
    //           <div className="filter">{selectedFilters[2] || ''}</div>
    //           <div className="filter">{selectedFilters[3] || ''}</div>
    //         </div>
    //       </span>
    //       <span className="filters-selected-column">
    //         <div className="filters">
    //           <div className="filter">{selectedFilters[4] || ''}</div>
    //           <div className="filter">{selectedFilters[5] || ''}</div>
    //         </div>
    //       </span>
    //       <span className="filters-selected-column">
    //         <div className="filters">
    //           <div className="filter">{selectedFilters[6] || ''}</div>
    //           <div className="filter">{selectedFilters[7] || ''}</div>
    //         </div>
    //       </span>
    //       <span className="filters-selected-column">
    //         <div className="filters">
    //           <div className="filter">{selectedFilters[8] || ''}</div>
    //         </div>
    //       </span>
    //     </div>
    //   </div>
    // </>
  );
};
