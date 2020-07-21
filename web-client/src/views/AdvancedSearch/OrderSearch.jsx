import { AdvancedDocumentSearch } from './AdvancedDocumentSearch';
import { Button } from '../../ustc-ui/Button/Button';
import { NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { OrderSearchByKeyword } from './OrderSearchByKeyword';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const OrderSearch = connect(
  {
    clearAdvancedSearchFormSequence: sequences.clearAdvancedSearchFormSequence,
    judges: state.judges,
    updateAdvancedOrderSearchFormValueSequence:
      sequences.updateAdvancedOrderSearchFormValueSequence,
    validateOrderSearchSequence: sequences.validateOrderSearchSequence,
    validationErrors: state.validationErrors,
  },
  function OrderSearch({
    clearAdvancedSearchFormSequence,
    judges,
    submitAdvancedSearchSequence,
    updateAdvancedOrderSearchFormValueSequence,
    validateOrderSearchSequence,
    validationErrors,
  }) {
    return (
      <>
        <div className="header-with-blue-background grid-row">
          <h3>Search Orders</h3>
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
