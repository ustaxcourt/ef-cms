import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { OrderSearch } from './OrderSearch';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const OrderSearchForm = connect(
  { advancedSearchForm: state.advancedSearchForm },
  function OrderSearchForm() {
    return (
      <>
        <Mobile>
          <OrderSearch />
        </Mobile>

        <NonMobile>
          <div className="grid-column">
            <OrderSearch />
          </div>
        </NonMobile>
      </>
    );
  },
);
