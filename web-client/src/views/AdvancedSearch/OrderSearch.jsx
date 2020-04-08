import { Button } from '../../ustc-ui/Button/Button';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const OrderSearch = connect(
  {
    advancedSearchForm: state.advancedSearchForm,
    updateAdvancedSearchFormValueSequence:
      sequences.updateAdvancedSearchFormValueSequence,
    validateOrderSearchSequence: sequences.validateOrderSearchSequence,
    validationErrors: state.validationErrors,
  },
  function OrderSearch({
    advancedSearchForm,
    submitAdvancedSearchSequence,
    updateAdvancedSearchFormValueSequence,
    validateOrderSearchSequence,
    validationErrors,
  }) {
    return (
      <>
        <div className="header-with-blue-background grid-row">
          <h3>Search Orders</h3>
        </div>
        <div className="blue-container order-search-container grid-row">
          <form
            onSubmit={e => {
              e.preventDefault();
              submitAdvancedSearchSequence();
            }}
          >
            <div className="grid-row grid-gap">
              <div className="tablet:grid-col-12">
                <h4>Enter Keyword or Phrase</h4>
                <FormGroup errorText={validationErrors.orderKeyword}>
                  <label className="usa-label" htmlFor="order-search">
                    Search for...
                  </label>
                  <input
                    className="usa-input"
                    id="order-search"
                    name="orderKeyword"
                    type="text"
                    value={advancedSearchForm.orderSearch.orderKeyword || ''}
                    onBlur={() => validateOrderSearchSequence()}
                    onChange={e => {
                      updateAdvancedSearchFormValueSequence({
                        formType: 'orderSearch',
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </FormGroup>
              </div>
            </div>

            <div className="grid-row">
              <div className="tablet:grid-col-12">
                <Button
                  className="margin-bottom-0"
                  id="advanced-search-button"
                  type="submit"
                >
                  Search
                </Button>
                <Button link className="padding-0 ustc-button--mobile-inline">
                  Clear Search
                </Button>
              </div>
            </div>
          </form>
        </div>
      </>
    );
  },
);
