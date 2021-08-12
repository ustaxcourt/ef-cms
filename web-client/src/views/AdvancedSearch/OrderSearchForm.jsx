import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { Button } from '../../ustc-ui/Button/Button';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { SearchDateRangePickerComponent } from './SearchDateRangePickerComponent';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const OrderSearchForm = connect(
  {
    advancedSearchForm: state.advancedSearchForm,
    advancedSearchHelper: state.advancedSearchHelper,
    clearAdvancedSearchFormSequence: sequences.clearAdvancedSearchFormSequence,
    judges: state.legacyAndCurrentJudges,
    updateAdvancedOrderSearchFormValueSequence:
      sequences.updateAdvancedOrderSearchFormValueSequence,
    validateOrderSearchSequence: sequences.validateOrderSearchSequence,
    validationErrors: state.validationErrors,
  },
  function OrderSearchForm({
    advancedSearchForm,
    advancedSearchHelper,
    clearAdvancedSearchFormSequence,
    judges,
    submitAdvancedSearchSequence,
    updateAdvancedOrderSearchFormValueSequence,
    validateOrderSearchSequence,
    validationErrors,
  }) {
    return (
      <>
        <Mobile>
          <form
            onSubmit={e => {
              e.preventDefault();
              submitAdvancedSearchSequence();
            }}
          >
            <div className="blue-container">
              <div className="grid-row">
                <div className="border-bottom-1px border-base-light padding-bottom-3">
                  <p>
                    <span className="text-semibold">
                      Search by keyword and phrase
                    </span>
                  </p>
                  <input
                    aria-describedby="search-orders-header search-description"
                    className="usa-input maxw-tablet-lg"
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

                <div className="grid-col-5">
                  <FormGroup
                    className="advanced-search-panel full-width"
                    errorText={validationErrors.chooseOneValue}
                  >
                    <div className="margin-bottom-3 margin-top-3">
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
                            value: e.target.value.toUpperCase(),
                          });
                        }}
                      />
                    </div>

                    <div className="width-full margin-bottom-3 padding-right-2">
                      or
                    </div>
                    <div>
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
                  </FormGroup>
                </div>
              </div>
              <div className="grid-row grid-gap-6">
                <div className="judge-search-row margin-top-4">
                  <label className="usa-label" htmlFor="order-date-range">
                    Judge
                  </label>
                  <BindedSelect
                    bind={'advancedSearchForm.orderSearch.judge'}
                    className="usa-input"
                    id="order-judge"
                    name="judge"
                  >
                    <option value="">All judges</option>
                    {judges.map(judge => (
                      <option
                        key={judge.judgeFullName}
                        value={judge.judgeFullName}
                      >
                        {judge.name}
                      </option>
                    ))}
                  </BindedSelect>
                </div>
                <div className="margin-top-4 desktop:padding-bottom-5">
                  <label className="usa-label" htmlFor="order-date-range">
                    Date range
                  </label>
                  <BindedSelect
                    bind={'advancedSearchForm.orderSearch.dateRange'}
                    className="usa-input"
                    id="order-date-range"
                    name="date-range"
                  >
                    <option value="allDates">All dates</option>
                    <option value="customDates">Custom dates</option>
                  </BindedSelect>
                </div>
                {advancedSearchHelper.showDateRangePicker && (
                  <div className="margin-top-4">
                    <SearchDateRangePickerComponent
                      formType="orderSearch"
                      updateSequence={
                        updateAdvancedOrderSearchFormValueSequence
                      }
                      validateSequence={validateOrderSearchSequence}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="margin-top-4">
              <Button
                className="margin-bottom-0"
                id="advanced-search-button"
                type="submit"
              >
                Search
              </Button>
              <Button
                link
                className="padding-0 margin-top-2 text-center"
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
          </form>
        </Mobile>
        <NonMobile>
          <form
            onSubmit={e => {
              e.preventDefault();
              submitAdvancedSearchSequence();
            }}
          >
            <div className="blue-container order-search-container">
              <div className="grid-row grid-gap-6">
                <div className="grid-col-7 right-gray-border">
                  <p className="margin-top-0">
                    <span className="text-semibold">
                      Search by keyword and phrase
                    </span>
                  </p>
                  <input
                    aria-describedby="search-orders-header search-description"
                    className="usa-input maxw-tablet-lg"
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

                <div className="grid-col-5">
                  <FormGroup
                    className="advanced-search-panel full-width"
                    errorText={validationErrors.chooseOneValue}
                  >
                    <div className="margin-bottom-3 desktop:margin-bottom-0">
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
                            value: e.target.value.toUpperCase(),
                          });
                        }}
                      />
                    </div>

                    <div className="desktop:text-center desktop:padding-top-6 width-full desktop:width-auto desktop:margin-bottom-2 padding-left-2 padding-right-2">
                      or
                    </div>
                    <div className="margin-bottom-6 desktop:margin-bottom-0">
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
                  </FormGroup>
                </div>
              </div>
              <div className="grid-row grid-gap-6">
                <div className="judge-search-row margin-top-4">
                  <label className="usa-label" htmlFor="order-date-range">
                    Judge
                  </label>
                  <BindedSelect
                    bind={'advancedSearchForm.orderSearch.judge'}
                    className="usa-input"
                    id="order-judge"
                    name="judge"
                  >
                    <option value="">All judges</option>
                    {judges.map(judge => (
                      <option
                        key={judge.judgeFullName}
                        value={judge.judgeFullName}
                      >
                        {judge.name}
                      </option>
                    ))}
                  </BindedSelect>
                </div>
                <div className="margin-top-4 desktop:padding-bottom-5">
                  <label className="usa-label" htmlFor="order-date-range">
                    Date range
                  </label>
                  <BindedSelect
                    bind={'advancedSearchForm.orderSearch.dateRange'}
                    className="usa-input"
                    id="order-date-range"
                    name="date-range"
                  >
                    <option value="allDates">All dates</option>
                    <option value="customDates">Custom dates</option>
                  </BindedSelect>
                </div>
                {advancedSearchHelper.showDateRangePicker && (
                  <div className="margin-top-4">
                    <SearchDateRangePickerComponent
                      formType="orderSearch"
                      updateSequence={
                        updateAdvancedOrderSearchFormValueSequence
                      }
                      validateSequence={validateOrderSearchSequence}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="margin-top-4" id="order-basic">
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
            </div>
          </form>
        </NonMobile>
      </>
    );
  },
);
