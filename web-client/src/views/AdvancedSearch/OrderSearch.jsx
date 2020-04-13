import { Button } from '../../ustc-ui/Button/Button';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const OrderSearch = connect(
  {
    advancedSearchForm: state.advancedSearchForm,
    clearAdvancedSearchFormSequence: sequences.clearAdvancedSearchFormSequence,
    updateAdvancedSearchFormValueSequence:
      sequences.updateAdvancedSearchFormValueSequence,
    validateOrderSearchSequence: sequences.validateOrderSearchSequence,
    validationErrors: state.validationErrors,
  },
  function OrderSearch({
    advancedSearchForm,
    clearAdvancedSearchFormSequence,
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
            className="grid-row grid-col-12 grid-gap"
            onSubmit={e => {
              e.preventDefault();
              submitAdvancedSearchSequence();
            }}
          >
            <div className="grid-col">
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
                  <Button
                    link
                    className="padding-0 ustc-button--mobile-inline"
                    onClick={e => {
                      e.preventDefault();
                      clearAdvancedSearchFormSequence({
                        formType: 'orderSearch',
                      });
                    }}
                  >
                    Clear Search
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid-col">
              <h3>Narrow your search (optional)</h3>
              <div className="grid-row docket-or-petitionerName-field">
                <div className="grid-col-3">
                  <label className="usa-label" htmlFor="order-search">
                    Docket number
                  </label>
                  <input
                    className="usa-input"
                    id="order-search"
                    name="orderKeyword"
                    type="text"
                  />
                </div>
                <div className="grid-col-2">
                  <label className="usa-label" htmlFor="order-search"></label>
                  or
                </div>
                <div className="grid-col-7">
                  <label className="usa-label" htmlFor="order-search">
                    Case title / Petitioner&apos;s name
                  </label>
                  <input
                    className="usa-input"
                    id="order-search"
                    name="orderKeyword"
                    type="text"
                  />
                </div>
              </div>
              <div className="grid-row judge-field">
                <label className="usa-label grid-row" htmlFor="order-search">
                  Judge
                </label>
                <select
                  className="usa-input grid-row"
                  id="order-search"
                  name="orderKeyword"
                  type="text"
                />
              </div>
            </div>
          </form>
        </div>
      </>
    );
  },
);
