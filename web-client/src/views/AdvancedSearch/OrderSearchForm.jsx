import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { HowToSearch } from './AdvancedDocumentSearch/HowToSearch';
import { KeywordSearchField } from './AdvancedDocumentSearch/KeywordSearchField';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { SearchDateRangePickerComponent } from './SearchDateRangePickerComponent';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const OrderSearchForm = connect(
  {
    DATE_RANGE_SEARCH_OPTIONS: state.constants.DATE_RANGE_SEARCH_OPTIONS,
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
    DATE_RANGE_SEARCH_OPTIONS,
    judges,
    submitAdvancedSearchSequence,
    updateAdvancedOrderSearchFormValueSequence,
    validateOrderSearchSequence,
    validationErrors,
  }) {
    const DocketNumberField = () => (
      <>
        <label className="usa-label text-no-wrap" htmlFor="docket-number">
          Docket number
        </label>
        <input
          className="usa-input maxw-15"
          id="docket-number"
          name="docketNumber"
          type="text"
          value={advancedSearchForm.orderSearch.docketNumber || ''}
          onBlur={() => validateOrderSearchSequence()}
          onChange={e => {
            updateAdvancedOrderSearchFormValueSequence({
              key: e.target.name,
              value: e.target.value.toUpperCase(),
            });
          }}
        />
      </>
    );

    const CaseTitleOrNameField = () => (
      <>
        <div>
          <label className="usa-label text-no-wrap" htmlFor="title-or-name">
            Case title / Petitioner’s name
          </label>
          <input
            className="usa-input"
            id="title-or-name"
            name="caseTitleOrPetitioner"
            type="text"
            value={advancedSearchForm.orderSearch.caseTitleOrPetitioner || ''}
            onBlur={() => validateOrderSearchSequence()}
            onChange={e => {
              updateAdvancedOrderSearchFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
        </div>
      </>
    );

    const JudgeSelect = () => (
      <>
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
            <option key={judge.judgeFullName} value={judge.judgeFullName}>
              {judge.name}
            </option>
          ))}
        </BindedSelect>
      </>
    );

    const DateRangeSelect = () => (
      <>
        <label className="usa-label" htmlFor="order-date-range">
          Date range
        </label>
        <select
          className="usa-select"
          id="order-date-range"
          name="dateRange"
          value={advancedSearchForm.orderSearch.dateRange}
          onChange={e => {
            updateAdvancedOrderSearchFormValueSequence({
              key: e.target.name,
              value: e.target.value,
            });
            validateOrderSearchSequence();
          }}
        >
          <option value={DATE_RANGE_SEARCH_OPTIONS.ALL_DATES}>All dates</option>
          <option value={DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES}>
            Custom dates
          </option>
        </select>
      </>
    );

    return (
      <>
        <form
          onSubmit={e => {
            e.preventDefault();
            submitAdvancedSearchSequence();
          }}
        >
          <Mobile>
            <div className="margin-bottom-3">
              <HowToSearch />
            </div>
            <div className="blue-container">
              <div className="grid-row">
                <div className="border-bottom-1px border-base-light padding-bottom-3">
                  <KeywordSearchField
                    searchValue={advancedSearchForm.orderSearch.keyword}
                    updateSequence={updateAdvancedOrderSearchFormValueSequence}
                    validateSequence={validateOrderSearchSequence}
                  />
                </div>
                <FormGroup
                  className="advanced-search-panel full-width"
                  errorText={validationErrors.chooseOneValue}
                >
                  <div className="margin-bottom-3 margin-top-3">
                    {DocketNumberField()}
                  </div>
                  <div className="width-full margin-bottom-3 padding-right-2">
                    or
                  </div>

                  {CaseTitleOrNameField()}
                </FormGroup>
              </div>
              <div className="grid-row grid-gap-6">
                <div className="judge-search-row margin-top-4">
                  {JudgeSelect()}
                </div>
                <div className="margin-top-4">{DateRangeSelect()}</div>

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
          </Mobile>
          <NonMobile>
            <div className="grid-row no-flex-wrap">
              <div className="blue-container grid-col-9 padding-bottom-0 margin-right-1">
                <div className="grid-row grid-gap-6">
                  <div className="custom-col-7 desktop:grid-col-5 grid-col-12 right-gray-border padding-bottom-2">
                    <KeywordSearchField
                      searchValue={advancedSearchForm.orderSearch.keyword}
                      updateSequence={
                        updateAdvancedOrderSearchFormValueSequence
                      }
                      validateSequence={validateOrderSearchSequence}
                    />
                  </div>

                  <div className="custom-col-5 desktop:grid-col-7 grid-col-12">
                    <FormGroup
                      className="advanced-search-panel full-width"
                      errorText={validationErrors.chooseOneValue}
                    >
                      <div className="margin-bottom-0">
                        {DocketNumberField()}
                      </div>

                      <div className="desktop:text-center padding-top-6 desktop:width-full desktop:width-auto desktop:margin-bottom-2 padding-left-2 padding-right-2">
                        or
                      </div>

                      {CaseTitleOrNameField()}
                    </FormGroup>
                  </div>
                </div>
                <div className="grid-row grid-gap-3 margin-top-2">
                  <div className="grid-row desktop:grid-col-5 grid-col-12 grid-gap-3 no-flex-wrap">
                    <div className="width-card-lg">{JudgeSelect()}</div>
                    <div className="width-card-lg tablet:padding-bottom-5">
                      {DateRangeSelect()}
                    </div>
                  </div>

                  <div className="desktop:grid-col-7 grid-col-12">
                    <div className="grid-gap-3 tablet:margin-top-0 margin-top-4">
                      {advancedSearchHelper.showDateRangePicker && (
                        <div className="grid-row no-flex-wrap">
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
                </div>
              </div>
              <div className="grid-col-3 margin-left-1">
                <HowToSearch />
              </div>
            </div>
          </NonMobile>

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
      </>
    );
  },
);
