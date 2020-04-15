import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { connect } from '@cerebral/react';
import React from 'react';

export const PublicOrderSearch = connect({}, function PublicOrderSearch() {
  return (
    <>
      <div className="header-with-blue-background grid-row">
        <h3>Search Orders</h3>
      </div>
      <div className="blue-container order-search-container grid-row">
        <>
          <Mobile>
            {/* <OrderSearch
              submitAdvancedSearchSequence={submitAdvancedSearchSequence}
            /> */}
          </Mobile>

          <NonMobile>
            <div className="grid-column">
              {/* <OrderSearch
                submitAdvancedSearchSequence={submitAdvancedSearchSequence}
              /> */}
            </div>
          </NonMobile>
        </>{' '}
      </div>
    </>
  );
});
