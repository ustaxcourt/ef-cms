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
      <div className="blue-container advanced-search__form-container grid-row">
        <form
          onSubmit={e => {
            e.preventDefault();
            submitAdvancedSearchSequence();
          }}
        >
          <div className="grid-row grid-gap">
            <div className="tablet:grid-col-12">
              <FormGroup>
                <h4 className="margin-top-105">Enter Keyword or Phrase</h4>
                <label
                  className="usa-label margin-bottom-05"
                  htmlFor="order-search"
                >
                  Search for...
                </label>
                <input
                  className="usa-input"
                  id="order-search"
                  name="petitionerName"
                  type="text"
                  // onChange={e => {
                  //   updateAdvancedSearchFormValueSequence({
                  //     formType: 'caseSearchByName',
                  //     key: e.target.name,
                  //     value: e.target.value,
                  //   });
                  // }}
                />
              </FormGroup>
            </div>
          </div>

          <div className="grid-row">
            <div className="tablet:grid-col-12">
              <Button
                className="advanced-search__button"
                id="advanced-search-button"
                type="submit"
              >
                Search
              </Button>
              <Button
                link
                className="margin-left-1 tablet:margin-left-205 margin-right-0 padding-0 ustc-button--mobile-inline"
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
