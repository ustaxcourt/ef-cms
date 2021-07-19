import { AdvancedDocumentSearch } from './AdvancedDocumentSearch';
import { Button } from '../../ustc-ui/Button/Button';
import { NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { OrderSearchByKeyword } from './OrderSearchByKeyword';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const OrderSearch = connect(
  {
    advancedSearchForm: state.advancedSearchForm,
    clearAdvancedSearchFormSequence: sequences.clearAdvancedSearchFormSequence,
    judges: state.legacyAndCurrentJudges,
    updateAdvancedOrderSearchFormValueSequence:
      sequences.updateAdvancedOrderSearchFormValueSequence,
    validateOrderSearchSequence: sequences.validateOrderSearchSequence,
    validationErrors: state.validationErrors,
  },
  function OrderSearch({
    advancedSearchForm,
    clearAdvancedSearchFormSequence,
    judges,
    submitAdvancedSearchSequence,
    updateAdvancedOrderSearchFormValueSequence,
    validateOrderSearchSequence,
    validationErrors,
  }) {
    return (
      <>
        <div className="header-with-blue-background">
          <p>Search orders (required)</p>
          <input
            aria-describedby="search-orders-header search-description"
            className="usa-input maxw-full"
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
        </div>
        <div className="blue-container order-search-container">
          <form
            className="grid-container grid-row"
            onSubmit={e => {
              e.preventDefault();
              submitAdvancedSearchSequence();
            }}
          >
            <div className="grid-col" id="order-basic">
              <OrderSearchByKeyword validationErrors={validationErrors} />

              <NonMobile>
                <div className="grid-row margin-top-10">
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
              </NonMobile>
            </div>
            <AdvancedDocumentSearch
              formType="orderSearch"
              judges={judges}
              updateSequence={updateAdvancedOrderSearchFormValueSequence}
              validateSequence={validateOrderSearchSequence}
              validationErrors={validationErrors}
            />
          </form>
        </div>
      </>
    );
  },
);
