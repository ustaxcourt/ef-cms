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
          <div className="tablet:grid-col-12">
            <h4>Enter Keyword or Phrase</h4>
            <FormGroup errorText={validationErrors.keyword}>
              <label className="usa-label" htmlFor="order-search">
                Search for...
              </label>
              <input
                className="usa-input"
                id="order-search"
                name="keyword"
                type="text"
                value={advancedSearchForm.orderSearch.keyword || ''}
                onBlur={() => validateOrderSearchSequence()}
                onChange={e => {
                  updateAdvancedOrderSearchFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </FormGroup>
          </div>
        </div>
      </>
    );
  },
);
