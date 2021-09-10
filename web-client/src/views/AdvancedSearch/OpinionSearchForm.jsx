import { AdvancedDocumentSearch } from './AdvancedDocumentSearch';
import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { HowToSearch } from './AdvancedDocumentSearch/HowToSearch';
import { KeywordSearchField } from './AdvancedDocumentSearch/KeywordSearchField';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { OpinionSearchByKeyword } from './OpinionSearchByKeyword';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const OpinionSearchForm = connect(
  {
    advancedSearchForm: state.advancedSearchForm,
    clearAdvancedSearchFormSequence: sequences.clearAdvancedSearchFormSequence,
    judges: state.legacyAndCurrentJudges,
    updateAdvancedOpinionSearchFormValueSequence:
      sequences.updateAdvancedOpinionSearchFormValueSequence,
    validateOpinionSearchSequence: sequences.validateOpinionSearchSequence,
    validationErrors: state.validationErrors,
  },
  function OpinionSearchForm({
    advancedSearchForm,
    clearAdvancedSearchFormSequence,
    judges,
    submitAdvancedSearchSequence,
    updateAdvancedOpinionSearchFormValueSequence,
    validateOpinionSearchSequence,
    validationErrors,
  }) {
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
                    searchValue={advancedSearchForm.opinionSearch.keyword}
                    updateSequence={
                      updateAdvancedOpinionSearchFormValueSequence
                    }
                    validateSequence={validateOpinionSearchSequence}
                  />
                </div>
                {/* <FormGroup
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
                </FormGroup> */}
              </div>
              <div className="grid-row grid-gap-6">
                {/* <div className="judge-search-row margin-top-4">
                  {JudgeSelect()}
                </div> */}
                {/* <div className="margin-top-4">{DateRangeSelect()}</div> */}

                {/* {advancedSearchHelper.showDateRangePicker && (
                  <div className="margin-top-4">
                    <SearchDateRangePickerComponent
                      formType="orderSearch"
                      updateSequence={
                        updateAdvancedOrderSearchFormValueSequence
                      }
                      validateSequence={validateOrderSearchSequence}
                    />
                  </div>
                )} */}
              </div>
            </div>
          </Mobile>
          <NonMobile>
            <div className="grid-row no-flex-wrap">
              <div className="blue-container grid-col-9 padding-bottom-0 margin-right-1">
                <div className="grid-row grid-gap-6">
                  <div className="custom-col-7 desktop:grid-col-5 grid-col-12 right-gray-border padding-bottom-2">
                    <KeywordSearchField
                      searchValue={advancedSearchForm.opinionSearch.keyword}
                      updateSequence={
                        updateAdvancedOpinionSearchFormValueSequence
                      }
                      validateSequence={validateOpinionSearchSequence}
                    />
                  </div>

                  <div className="custom-col-5 desktop:grid-col-7 grid-col-12">
                    <FormGroup
                      className="advanced-search-panel full-width"
                      errorText={validationErrors.chooseOneValue}
                    >
                      <div className="margin-bottom-0">
                        {/* {DocketNumberField()} */}
                      </div>

                      <div className="desktop:text-center padding-top-6 desktop:width-full desktop:width-auto desktop:margin-bottom-2 padding-left-2 padding-right-2">
                        or
                      </div>

                      {/* {CaseTitleOrNameField()} */}
                    </FormGroup>
                  </div>
                </div>
                <div className="grid-row grid-gap-3 margin-top-2">
                  <div className="grid-row desktop:grid-col-5 grid-col-12 grid-gap-3 no-flex-wrap">
                    {/* <div className="width-card-lg">{JudgeSelect()}</div> */}
                    <div className="width-card-lg tablet:padding-bottom-5">
                      {/* {DateRangeSelect()} */}
                    </div>
                  </div>

                  <div className="desktop:grid-col-7 grid-col-12">
                    <div className="grid-gap-3 tablet:margin-top-0 margin-top-4">
                      {/* {advancedSearchHelper.showDateRangePicker && (
                        <div className="grid-row no-flex-wrap">
                          <SearchDateRangePickerComponent
                            formType="orderSearch"
                            updateSequence={
                              updateAdvancedOrderSearchFormValueSequence
                            }
                            validateSequence={validateOrderSearchSequence}
                          />
                        </div>
                      )} */}
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
        {/* <div
          className="header-with-blue-background grid-row"
          id="opinion-search-form"
        >
          <h3>Search Opinions</h3>
        </div>
        <div className="blue-container opinion-search-container">
          <form
            className="grid-container grid-row"
            onSubmit={e => {
              e.preventDefault();
              submitAdvancedSearchSequence();
            }}
          >
            <div className="grid-col" id="opinion-basic">
              <OpinionSearchByKeyword />

              <NonMobile>
                <div className="grid-row margin-top-10">
                  <div className="tablet:grid-col-12">
                    <Button
                      aria-describedby="opinion-search-form"
                      className="margin-bottom-0"
                      id="advanced-search-button"
                      type="submit"
                    >
                      Search
                    </Button>
                    <Button
                      link
                      aria-describedby="opinion-search-form"
                      className="padding-0 ustc-button--mobile-inline"
                      onClick={e => {
                        e.preventDefault();
                        clearAdvancedSearchFormSequence({
                          formType: 'opinionSearch',
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
              formType="opinionSearch"
              judges={judges}
              updateSequence={updateAdvancedOpinionSearchFormValueSequence}
              validateSequence={validateOpinionSearchSequence}
              validationErrors={validationErrors}
            />
          </form>
        </div> */}
      </>
    );
  },
);
