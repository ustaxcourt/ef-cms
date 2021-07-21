import { AdvancedDocumentSearch } from './AdvancedDocumentSearch';
import { Button } from '../../ustc-ui/Button/Button';
import { NonMobile } from '../../ustc-ui/Responsive/Responsive';
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
        <p>
          Enter keywords in quotes to search for exact matches only. For
          example, search “innocent spouse” for results containing that exact
          phrase.
        </p>
        <div className="bg-primary-dark text-white padding-4">
          <p className="margin-top-0 ">
            <span className="text-semibold">Search orders </span>(required)
          </p>
          <input
            aria-describedby="search-orders-header search-description"
            className="usa-input maxw-tablet-lg"
            id="order-search"
            name="keyword"
            placeholder="Enter keyword or phrase"
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
            onSubmit={e => {
              e.preventDefault();
              submitAdvancedSearchSequence();
            }}
          >
            <AdvancedDocumentSearch
              formType="orderSearch"
              judges={judges}
              updateSequence={updateAdvancedOrderSearchFormValueSequence}
              validateSequence={validateOrderSearchSequence}
              validationErrors={validationErrors}
            />
            <div className="padding-left-2" id="order-basic">
              <NonMobile>
                <div>
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
              </NonMobile>
            </div>
          </form>
        </div>
      </>
    );
  },
);
