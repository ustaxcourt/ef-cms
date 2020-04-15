import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
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

              <div className="grid-row margin-top-7">
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
                    name="docketNumber"
                    type="text"
                    value={advancedSearchForm.orderSearch.docketNumber || ''}
                    onChange={e => {
                      updateAdvancedSearchFormValueSequence({
                        formType: 'orderSearch',
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="grid-col-2">
                  <legend className="usa-label" htmlFor="order-search">
                    or
                  </legend>
                </div>
                <div className="grid-col-7">
                  <legend className="usa-label" htmlFor="order-search">
                    Case title / Petitioner&apos;s name
                  </legend>
                  <input
                    className="usa-input"
                    id="order-search"
                    name="caseTitleOrPetitioner"
                    type="text"
                    value={
                      advancedSearchForm.orderSearch.caseTitleOrPetitioner || ''
                    }
                    onChange={e => {
                      updateAdvancedSearchFormValueSequence({
                        formType: 'orderSearch',
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="grid-row">
                <div className="grid-col-6">
                  <legend className="usa-label" htmlFor="order-search">
                    Judge
                  </legend>
                  <BindedSelect
                    bind="advancedSearchForm.orderSearch.judge"
                    className="usa-input"
                    id="order-search"
                    name="judge"
                    onChange={e => {
                      updateAdvancedSearchFormValueSequence({
                        formType: 'orderSearch',
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  >
                    <option value="">Select</option>
                  </BindedSelect>
                </div>
              </div>
              <div className="grid-row">
                <legend className="display-block" id="year-filed-legend">
                  Date
                </legend>
              </div>
              <div className="grid-row">
                <div className="grid-col-1">
                  <input
                    aria-describedby="year-filed-legend"
                    aria-label="starting month, two digits"
                    className="usa-input"
                    id="month-filed-min"
                    name="monthFiledMin"
                    placeholder="MM"
                    type="text"
                    value={''}
                    onChange={e => {
                      updateAdvancedSearchFormValueSequence({
                        formType: 'orderSearch',
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="grid-col-1">
                  <input
                    aria-describedby="year-filed-legend"
                    aria-label="starting date, two digits"
                    className="usa-input"
                    id="date-filed-min"
                    name="dateFiledMin"
                    placeholder="DD"
                    type="text"
                    value={''}
                    onChange={e => {
                      updateAdvancedSearchFormValueSequence({
                        formType: 'orderSearch',
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="grid-col-1">
                  <input
                    aria-describedby="year-filed-legend"
                    aria-label="starting year, four digits"
                    className="usa-input"
                    id="year-filed-min"
                    name="yearFiledMin"
                    placeholder="YYYY"
                    type="text"
                    value={''}
                    onChange={e => {
                      updateAdvancedSearchFormValueSequence({
                        formType: 'orderSearch',
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </div>
                <legend className="usa-label" htmlFor="order-search">
                  to
                </legend>
                <div className="grid-col-1">
                  <input
                    aria-describedby="year-filed-legend"
                    aria-label="ending month, two digits"
                    className="usa-input"
                    id="month-filed-max"
                    name="monthFiledMax"
                    placeholder="MM"
                    type="text"
                    value={''}
                    onChange={e => {
                      updateAdvancedSearchFormValueSequence({
                        formType: 'orderSearch',
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="grid-col-1">
                  <input
                    aria-describedby="year-filed-legend"
                    aria-label="ending date, two digits"
                    className="usa-input"
                    id="date-filed-max"
                    name="dateFiledMax"
                    placeholder="DD"
                    type="text"
                    value={''}
                    onChange={e => {
                      updateAdvancedSearchFormValueSequence({
                        formType: 'orderSearch',
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="grid-col-1">
                  <input
                    aria-describedby="year-filed-legend"
                    aria-label="ending year, four digits"
                    className="usa-input"
                    id="year-filed-max"
                    name="yearFiledMax"
                    placeholder="YYYY"
                    type="text"
                    value={''}
                    onChange={e => {
                      updateAdvancedSearchFormValueSequence({
                        formType: 'orderSearch',
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </>
    );
  },
);
