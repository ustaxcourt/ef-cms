import { Button } from '../../ustc-ui/Button/Button';
import { CaseTitleOrNameSearchField } from './AdvancedDocumentSearch/CaseTitleOrNameSearchField';
import { DateRangeSelect } from './AdvancedDocumentSearch/DateRangeSelect';
import { DocketNumberSearchField } from './AdvancedDocumentSearch/DocketNumberSearchField';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { HowToSearch } from './AdvancedDocumentSearch/HowToSearch';
import { JudgeSelect } from './AdvancedDocumentSearch/JudgeSelect';
import { KeywordSearchField } from './AdvancedDocumentSearch/KeywordSearchField';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { SearchDateRangePickerComponent } from './SearchDateRangePickerComponent';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const OrderSearchForm = connect(
  {
    advancedDocumentSearchHelper: state.advancedDocumentSearchHelper,
    advancedSearchForm: state.advancedSearchForm,
    clearAdvancedSearchFormSequence: sequences.clearAdvancedSearchFormSequence,
    updateAdvancedOrderSearchFormValueSequence:
      sequences.updateAdvancedOrderSearchFormValueSequence,
    validateOrderSearchSequence: sequences.validateOrderSearchSequence,
    validationErrors: state.validationErrors,
  },
  function OrderSearchForm({
    advancedDocumentSearchHelper,
    advancedSearchForm,
    clearAdvancedSearchFormSequence,
    submitAdvancedSearchSequence,
    updateAdvancedOrderSearchFormValueSequence,
    validateOrderSearchSequence,
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
                    searchValue={advancedSearchForm.orderSearch.keyword}
                    updateSequence={updateAdvancedOrderSearchFormValueSequence}
                    validateSequence={validateOrderSearchSequence}
                  />
                </div>
                <FormGroup
                  className="advanced-search-panel full-width"
                  errorText={validationErrors['object.oxor']}
                >
                  <div className="margin-bottom-3 margin-top-3">
                    <DocketNumberSearchField
                      searchValue={advancedSearchForm.orderSearch.docketNumber}
                      updateSequence={
                        updateAdvancedOrderSearchFormValueSequence
                      }
                      validateSequence={validateOrderSearchSequence}
                    />
                  </div>
                  <div className="width-full margin-bottom-3 padding-right-2">
                    or
                  </div>

                  <CaseTitleOrNameSearchField
                    searchValue={
                      advancedSearchForm.orderSearch.caseTitleOrPetitioner
                    }
                    updateSequence={updateAdvancedOrderSearchFormValueSequence}
                    validateSequence={validateOrderSearchSequence}
                  />
                </FormGroup>
              </div>
              <div className="grid-row grid-gap-6">
                <div className="judge-search-row margin-top-4">
                  <JudgeSelect
                    formValue={'advancedSearchForm.orderSearch.judge'}
                    judges={advancedDocumentSearchHelper.formattedJudges}
                  />
                </div>
                <div className="margin-top-4">
                  <DateRangeSelect
                    searchValue={advancedSearchForm.orderSearch.dateRange}
                    updateSequence={updateAdvancedOrderSearchFormValueSequence}
                    validateSequence={validateOrderSearchSequence}
                  />
                </div>

                {advancedDocumentSearchHelper.showDateRangePicker && (
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
                      className={classNames(
                        'advanced-search-panel',
                        'full-width',
                        validationErrors['object.oxor'] &&
                          'usa-form-group--error',
                      )}
                    >
                      <div className="margin-bottom-0">
                        <DocketNumberSearchField
                          searchValue={
                            advancedSearchForm.orderSearch.docketNumber
                          }
                          updateSequence={
                            updateAdvancedOrderSearchFormValueSequence
                          }
                          validateSequence={validateOrderSearchSequence}
                        />
                      </div>
                      <div className="desktop:text-center padding-top-6 desktop:width-full desktop:width-auto desktop:margin-bottom-2 padding-left-2 padding-right-2">
                        or
                      </div>

                      <CaseTitleOrNameSearchField
                        searchValue={
                          advancedSearchForm.orderSearch.caseTitleOrPetitioner
                        }
                        updateSequence={
                          updateAdvancedOrderSearchFormValueSequence
                        }
                        validateSequence={validateOrderSearchSequence}
                      />
                    </FormGroup>
                    <span className="usa-error-message">
                      {validationErrors['object.oxor']}
                    </span>
                  </div>
                </div>
                <div className="grid-row grid-gap-3 margin-top-2">
                  <div className="grid-row desktop:grid-col-5 grid-col-12 grid-gap-3 no-flex-wrap">
                    <div className="width-card-lg">
                      <JudgeSelect
                        formValue={'advancedSearchForm.orderSearch.judge'}
                        judges={advancedDocumentSearchHelper.formattedJudges}
                      />
                    </div>
                    <div className="width-card-lg tablet:padding-bottom-5">
                      <DateRangeSelect
                        searchValue={advancedSearchForm.orderSearch.dateRange}
                        updateSequence={
                          updateAdvancedOrderSearchFormValueSequence
                        }
                        validateSequence={validateOrderSearchSequence}
                      />
                    </div>
                  </div>

                  <div className="desktop:grid-col-7 grid-col-12">
                    <div className="grid-gap-3 tablet:margin-top-0 margin-top-4">
                      {advancedDocumentSearchHelper.showDateRangePicker && (
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
              id="clear-search"
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

OrderSearchForm.displayName = 'OrderSearchForm';
