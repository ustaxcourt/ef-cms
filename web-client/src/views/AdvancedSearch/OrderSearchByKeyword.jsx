import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const OrderSearchByKeyword = connect(
  {
    advancedSearchForm: state.advancedSearchForm,
    updateAdvancedOrderSearchFormValueSequence:
      sequences.updateAdvancedOrderSearchFormValueSequence,
    validateOrderSearchSequence: sequences.validateOrderSearchSequence,
  },
  function OrderSearchByKeyword({
    advancedSearchForm,
    updateAdvancedOrderSearchFormValueSequence,
    validateOrderSearchSequence,
    validationErrors,
  }) {
    return (
      <>
        <div className="grid-row grid-gap">
          <div className="tablet:grid-col-12" id="search-description">
            <h4>Enter Keyword or Phrase</h4>
          </div>
        </div>
      </>
    );
  },
);
