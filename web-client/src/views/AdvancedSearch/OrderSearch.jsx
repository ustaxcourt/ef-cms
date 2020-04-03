import { Button } from '../../ustc-ui/Button/Button';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import React from 'react';

export const OrderSearch = connect({}, function OrderSearch(
  submitAdvancedSearchSequence,
) {
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
              <FormGroup>
                <label className="usa-label" htmlFor="order-search">
                  Search for...
                </label>
                <input
                  className="usa-input"
                  id="order-search"
                  name="petitionerName"
                  type="text"
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
                // onClick={() => {
                //   clearCaseSearchByNameFormSequence();
                // }}
              >
                Clear Search
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
});
