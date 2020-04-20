import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { Button } from '../../ustc-ui/Button/Button';
import { DateInput } from '../../ustc-ui/DateInput/DateInput';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const OrderSearch = connect(
  {
    advancedSearchForm: state.advancedSearchForm,
    clearAdvancedSearchFormSequence: sequences.clearAdvancedSearchFormSequence,
    judges: state.judges,
    updateAdvancedOrderSearchFormValueSequence:
      sequences.updateAdvancedOrderSearchFormValueSequence,
    validateOrderSearchSequence: sequences.validateOrderSearchSequence,
    validateStartDateSequence: sequences.validateStartDateSequence,
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
                        updateAdvancedOrderSearchFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                      }}
                    />
                  </FormGroup>
                </div>
              </div>

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
            </div>

            <div className="grid-col" id="order-advanced">
              <div className="grid-container">
                <h4>Narrow your search (optional)</h4>
                <FormGroup errorText={validationErrors.chooseOneValue}>
                  <div className="grid-row">
                    <div className="grid-col-3">
                      <label className="usa-label" htmlFor="docket-number">
                        Docket number
                      </label>
                      <input
                        className="usa-input"
                        id="docket-number"
                        name="docketNumber"
                        type="text"
                        value={
                          advancedSearchForm.orderSearch.docketNumber || ''
                        }
                        onBlur={() => validateOrderSearchSequence()}
                        onChange={e => {
                          updateAdvancedOrderSearchFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div className="grid-col-2">
                      <div className="text-center padding-top-6">or</div>
                    </div>
                    <div className="grid-col-7">
                      <label className="usa-label" htmlFor="title-or-name">
                        Case title / Petitioner’s name
                      </label>
                      <input
                        className="usa-input"
                        id="title-or-name"
                        name="caseTitleOrPetitioner"
                        type="text"
                        value={
                          advancedSearchForm.orderSearch
                            .caseTitleOrPetitioner || ''
                        }
                        onBlur={() => validateOrderSearchSequence()}
                        onChange={e => {
                          updateAdvancedOrderSearchFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </div>
                </FormGroup>
                <FormGroup>
                  <div className="grid-row judge-search-row">
                    <label
                      className="usa-label padding-top-105"
                      htmlFor="order-judge"
                    >
                      Judge
                    </label>
                    <BindedSelect
                      bind="advancedSearchForm.orderSearch.judge"
                      className="usa-input"
                      id="order-judge"
                      name="judge"
                    >
                      <option value="">- Select -</option>
                      {judges.map((judge, idx) => (
                        <option key={idx} value={judge.userId}>
                          {judge.name}
                        </option>
                      ))}
                    </BindedSelect>
                  </div>
                  <div className="grid-row date-search-row">
                    <div className="grid-container padding-left-0 padding-right-0 margin-left-0 margin-right-0">
                      <div className="grid-row text-bold padding-top-2">
                        <span className="usa-label padding-top-1">Date</span>
                      </div>
                      <FormGroup>
                        <div className="grid-row">
                          <div className="grid-col-5">
                            <DateInput
                              hideLegend
                              errorText={
                                validationErrors.dateRangeRequired ||
                                validationErrors.startDate
                              }
                              id="start-date"
                              label="from Date"
                              names={{
                                day: 'startDateDay',
                                month: 'startDateMonth',
                                year: 'startDateYear',
                              }}
                              values={{
                                day:
                                  advancedSearchForm.orderSearch.startDateDay,
                                month:
                                  advancedSearchForm.orderSearch.startDateMonth,
                                year:
                                  advancedSearchForm.orderSearch.startDateYear,
                              }}
                              onBlur={validateOrderSearchSequence}
                              onChange={
                                updateAdvancedOrderSearchFormValueSequence
                              }
                            />
                          </div>
                          <div className="grid-col-2">
                            <div className="text-center padding-top-2">to</div>
                          </div>
                          <div className="grid-col-5">
                            <DateInput
                              hideLegend
                              errorText={
                                validationErrors.dateRangeRequired ||
                                validationErrors.endDate
                              }
                              id="end-date"
                              label="to Date"
                              names={{
                                day: 'endDateDay',
                                month: 'endDateMonth',
                                year: 'endDateYear',
                              }}
                              values={{
                                day: advancedSearchForm.orderSearch.endDateDay,
                                month:
                                  advancedSearchForm.orderSearch.endDateMonth,
                                year:
                                  advancedSearchForm.orderSearch.endDateYear,
                              }}
                              onBlur={validateOrderSearchSequence}
                              onChange={
                                updateAdvancedOrderSearchFormValueSequence
                              }
                            />
                          </div>
                        </div>
                      </FormGroup>
                    </div>
                  </div>
                </FormGroup>
              </div>
            </div>
          </form>
        </div>
      </>
    );
  },
);
