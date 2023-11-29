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

export const OpinionSearchForm = connect(
  {
    ADVANCED_SEARCH_OPINION_TYPES_LIST:
      state.constants.ADVANCED_SEARCH_OPINION_TYPES_LIST,
    advancedDocumentSearchHelper: state.advancedDocumentSearchHelper,
    advancedSearchForm: state.advancedSearchForm,
    clearAdvancedSearchFormSequence: sequences.clearAdvancedSearchFormSequence,
    updateAdvancedOpinionSearchFormValueSequence:
      sequences.updateAdvancedOpinionSearchFormValueSequence,
    validateOpinionSearchSequence: sequences.validateOpinionSearchSequence,
    validationErrors: state.validationErrors,
  },
  function OpinionSearchForm({
    ADVANCED_SEARCH_OPINION_TYPES_LIST,
    advancedDocumentSearchHelper,
    advancedSearchForm,
    clearAdvancedSearchFormSequence,
    submitAdvancedSearchSequence,
    updateAdvancedOpinionSearchFormValueSequence,
    validateOpinionSearchSequence,
    validationErrors,
  }) {
    return (
      <>
        <form
          id="opinion-search"
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
                <FormGroup
                  className="advanced-search-panel full-width"
                  errorText={validationErrors['object.oxor']}
                >
                  <div className="margin-bottom-3 margin-top-3">
                    <DocketNumberSearchField
                      searchValue={
                        advancedSearchForm.opinionSearch.docketNumber
                      }
                      updateSequence={
                        updateAdvancedOpinionSearchFormValueSequence
                      }
                      validateSequence={validateOpinionSearchSequence}
                    />
                  </div>

                  <div className="width-full margin-bottom-3 padding-right-2">
                    or
                  </div>

                  <CaseTitleOrNameSearchField
                    searchValue={
                      advancedSearchForm.opinionSearch.caseTitleOrPetitioner
                    }
                    updateSequence={
                      updateAdvancedOpinionSearchFormValueSequence
                    }
                    validateSequence={validateOpinionSearchSequence}
                  />
                </FormGroup>
              </div>
              <div className="grid-row grid-gap-6">
                <div className="judge-search-row margin-top-4">
                  <JudgeSelect
                    formValue={'advancedSearchForm.opinionSearch.judge'}
                    judges={advancedDocumentSearchHelper.formattedJudges}
                  />
                </div>
                <div className="margin-top-4">
                  <DateRangeSelect
                    searchValue={advancedSearchForm.opinionSearch.dateRange}
                    updateSequence={
                      updateAdvancedOpinionSearchFormValueSequence
                    }
                    validateSequence={validateOpinionSearchSequence}
                  />
                </div>

                {advancedDocumentSearchHelper.showDateRangePicker && (
                  <div className="margin-top-4">
                    <SearchDateRangePickerComponent
                      formType="opinionSearch"
                      updateSequence={
                        updateAdvancedOpinionSearchFormValueSequence
                      }
                      validateSequence={validateOpinionSearchSequence}
                    />
                  </div>
                )}

                <div className="grid-row grid-gap margin-bottom-2">
                  <legend className="usa-legend" id="include-types-legend">
                    Include types:
                  </legend>

                  {ADVANCED_SEARCH_OPINION_TYPES_LIST.map(
                    ({ eventCode, label }) => (
                      <div className="usa-checkbox width-full" key={eventCode}>
                        <input
                          checked={
                            advancedSearchForm.opinionSearch.opinionTypes &&
                            !!advancedSearchForm.opinionSearch.opinionTypes[
                              eventCode
                            ]
                          }
                          className="usa-checkbox__input include-types"
                          id={`opinionTypes.${eventCode}`}
                          name={`opinionTypes.${eventCode}`}
                          type="checkbox"
                          onChange={e => {
                            updateAdvancedOpinionSearchFormValueSequence({
                              key: e.target.name,
                              value: e.target.checked,
                            });
                          }}
                        />
                        <label
                          className="margin-top-0 usa-checkbox__label"
                          htmlFor={`opinionTypes.${eventCode}`}
                        >
                          {label}
                        </label>
                      </div>
                    ),
                  )}
                </div>
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
                            advancedSearchForm.opinionSearch.docketNumber
                          }
                          updateSequence={
                            updateAdvancedOpinionSearchFormValueSequence
                          }
                          validateSequence={validateOpinionSearchSequence}
                        />
                      </div>

                      <div className="desktop:text-center padding-top-6 desktop:width-full desktop:width-auto desktop:margin-bottom-2 padding-left-2 padding-right-2">
                        or
                      </div>

                      <CaseTitleOrNameSearchField
                        searchValue={
                          advancedSearchForm.opinionSearch.caseTitleOrPetitioner
                        }
                        updateSequence={
                          updateAdvancedOpinionSearchFormValueSequence
                        }
                        validateSequence={validateOpinionSearchSequence}
                      />
                    </FormGroup>
                    <span className="usa-error-message ">
                      {validationErrors['object.oxor']}
                    </span>
                  </div>
                </div>
                <div className="grid-row grid-gap-3 margin-top-2">
                  <div className="grid-row desktop:grid-col-5 grid-col-12 grid-gap-3 no-flex-wrap">
                    <div className="width-card-lg">
                      <JudgeSelect
                        formValue={'advancedSearchForm.opinionSearch.judge'}
                        judges={advancedDocumentSearchHelper.formattedJudges}
                      />
                    </div>
                    <div className="width-card-lg tablet:padding-bottom-5">
                      <DateRangeSelect
                        searchValue={advancedSearchForm.opinionSearch.dateRange}
                        updateSequence={
                          updateAdvancedOpinionSearchFormValueSequence
                        }
                        validateSequence={validateOpinionSearchSequence}
                      />
                    </div>
                  </div>

                  <div className="desktop:grid-col-7 grid-col-12">
                    <div className="grid-gap-3 tablet:margin-top-0 margin-top-4">
                      {advancedDocumentSearchHelper.showDateRangePicker && (
                        <div className="grid-row no-flex-wrap">
                          <SearchDateRangePickerComponent
                            formType="opinionSearch"
                            updateSequence={
                              updateAdvancedOpinionSearchFormValueSequence
                            }
                            validateSequence={validateOpinionSearchSequence}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid-row grid-gap margin-bottom-2">
                  <legend className="usa-legend" id="include-types-legend">
                    Include types:
                  </legend>

                  {ADVANCED_SEARCH_OPINION_TYPES_LIST.map(
                    ({ eventCode, label }) => (
                      <div className="usa-checkbox" key={eventCode}>
                        <input
                          checked={
                            advancedSearchForm.opinionSearch.opinionTypes &&
                            !!advancedSearchForm.opinionSearch.opinionTypes[
                              eventCode
                            ]
                          }
                          className="usa-checkbox__input include-types"
                          id={`opinionTypes.${eventCode}`}
                          name={`opinionTypes.${eventCode}`}
                          type="checkbox"
                          onChange={e => {
                            updateAdvancedOpinionSearchFormValueSequence({
                              key: e.target.name,
                              value: e.target.checked,
                            });
                          }}
                        />
                        <label
                          className="margin-top-0 usa-checkbox__label"
                          htmlFor={`opinionTypes.${eventCode}`}
                          id={`label-opinionTypes.${eventCode}`}
                        >
                          {label}
                        </label>
                      </div>
                    ),
                  )}
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
              data-testid="advanced-search-button"
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
                  formType: 'opinionSearch',
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

OpinionSearchForm.displayName = 'OpinionSearchForm';
