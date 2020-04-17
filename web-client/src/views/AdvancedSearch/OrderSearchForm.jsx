import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { OrderSearch } from './OrderSearch';
import { connect } from '@cerebral/react';
import React from 'react';

export const OrderSearchForm = connect({}, function OrderSearchForm({
  submitAdvancedSearchSequence,
}) {
  return (
    <>
      <Mobile>
        <OrderSearch
          submitAdvancedSearchSequence={submitAdvancedSearchSequence}
        />
      </Mobile>

      <NonMobile>
        <div className="grid-column">
          <OrderSearch
            submitAdvancedSearchSequence={submitAdvancedSearchSequence}
          />
        </div>
      </NonMobile>
    </>
  );
});
