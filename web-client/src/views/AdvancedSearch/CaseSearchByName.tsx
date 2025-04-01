import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { Button } from '../../ustc-ui/Button/Button';
import { DateRangePickerComponent } from '@web-client/ustc-ui/DateInput/DateRangePickerComponent';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { Mobile, NonMobile } from '@web-client/ustc-ui/Responsive/Responsive';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';
import { SelectSearch } from '@web-client/ustc-ui/Select/SelectSearch';
import { PillButton } from '@web-client/ustc-ui/Button/PillButton';
import { isEmpty } from 'lodash';
import {
  ALL_SELECTION,
  MULTI_SELECT_PLACEHOLDER,
} from '@shared/business/entities/EntityConstants';

export const CaseSearchByName = connect(
  {
    advancedSearchForm: state.advancedSearchForm,
    advancedSearchHelper: state.advancedSearchHelper,
    caseSearchByNameHelper: state.caseSearchByNameHelper,
    clearAdvancedSearchFormSequence: sequences.clearAdvancedSearchFormSequence,
    updateAdvancedSearchFormValueSequence:
      sequences.updateAdvancedSearchFormValueSequence,
    updateCaseAdvancedSearchByNameFormValueSequence:
      sequences.updateCaseAdvancedSearchByNameFormValueSequence,
    usStates: state.constants.US_STATES,
    usStatesOther: state.constants.US_STATES_OTHER,
    validateCaseAdvancedSearchFormSequence:
      sequences.validateCaseAdvancedSearchFormSequence,
    validateOrderSearchSequence: sequences.validateOrderSearchSequence,
    validationErrors: state.validationErrors,
  },
  function CaseSearchByName({
    advancedSearchForm,
    advancedSearchHelper,
    caseSearchByNameHelper,
    clearAdvancedSearchFormSequence,
    submitAdvancedSearchSequence,
    updateAdvancedSearchFormValueSequence,
    updateCaseAdvancedSearchByNameFormValueSequence,
    usStates,
    usStatesOther,
    validateCaseAdvancedSearchFormSequence,
    validationErrors,
  }) {
    return (
      <>
        <div
          className="header-with-blue-background display-flex flex-justify"
          data-testid="case-search-by-name-container"
        >
          <h3>Search by Name</h3>
        </div>
        <div className="blue-container height-full display-flex flex-column">
          <form>
            <div className="grid-row grid-gap">
              <div className="tablet:grid-col-12">
                <FormGroup errorText={validationErrors.petitionerName}>
                  <label
                    className="usa-label margin-bottom-0"
                    htmlFor="petitioner-name"
                  >
                    Petitioner name <span className="usa-hint">(required)</span>
                  </label>
                  <span className="usa-hint">
                    Advanced syntax search (*, “”, - , etc. ) is not supported
                    at this time.
                  </span>
                  <input
                    aria-describedby="case-search-by-name"
                    className="usa-input"
                    data-testid="petitioner-name"
                    id="petitioner-name"
                    name="petitionerName"
                    type="text"
                    value={
                      advancedSearchForm.caseSearchByName.petitionerName || ''
                    }
                    onBlur={() => {
                      validateCaseAdvancedSearchFormSequence();
                    }}
                    onChange={e => {
                      updateAdvancedSearchFormValueSequence({
                        formType: 'caseSearchByName',
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </FormGroup>
              </div>
            </div>
            <div className="grid-row grid-gap">
              <div className="tablet:grid-col-12">
                <div className="grid-row grid-gap">
                  <FormGroup className="margin-bottom-0" errorText="">
                    <fieldset
                      aria-label="scan mode selection"
                      className={classNames('usa-fieldset margin-bottom-3')}
                      id="scan-mode-radios"
                    >
                      <legend
                        className="usa-legend with-hint margin-bottom-2"
                        id="scan-mode-radios-legend"
                      >
                        Country
                      </legend>
                      <NonMobile>
                        <div className="usa-radio usa-radio__inline">
                          <input
                            checked={
                              advancedSearchForm.caseSearchByName
                                .countryType === ALL_SELECTION
                            }
                            className="usa-radio__input"
                            data-testid="all-country-selection"
                            id="all-country-selection"
                            name="country"
                            type="radio"
                            value={ALL_SELECTION}
                            onChange={e => {
                              updateCaseAdvancedSearchByNameFormValueSequence({
                                key: 'countryType',
                                value: e.target.value,
                              });
                            }}
                          />
                          <label
                            className="usa-radio__label"
                            htmlFor="all-country-selection"
                            id="all-country-selection-label"
                          >
                            All
                          </label>
                        </div>
                        <div className="usa-radio usa-radio__inline">
                          <input
                            checked={
                              advancedSearchForm.caseSearchByName
                                .countryType === 'domestic'
                            }
                            className="usa-radio__input"
                            id="united-states-country-selection"
                            name="country"
                            type="radio"
                            value="domestic"
                            onChange={e => {
                              updateCaseAdvancedSearchByNameFormValueSequence({
                                key: 'countryType',
                                value: e.target.value,
                              });
                            }}
                          />
                          <label
                            className="usa-radio__label"
                            htmlFor="united-states-country-selection"
                            id="united-states-country-selection-label"
                          >
                            United States
                          </label>
                        </div>
                        <div className="usa-radio usa-radio__inline">
                          <input
                            checked={
                              advancedSearchForm.caseSearchByName
                                .countryType === 'international'
                            }
                            className="usa-radio__input"
                            id="international-country-selection"
                            name="country"
                            type="radio"
                            value="international"
                            onChange={e => {
                              updateCaseAdvancedSearchByNameFormValueSequence({
                                key: 'countryType',
                                value: e.target.value,
                              });
                            }}
                          />
                          <label
                            className="usa-radio__label"
                            htmlFor="international-country-selection"
                            id="international-country-selection-label"
                          >
                            International
                          </label>
                        </div>
                      </NonMobile>

                      <Mobile>
                        <div className="usa-radio margin-bottom-1">
                          <input
                            aria-describedby="all-country-selection"
                            aria-labelledby="all-country-selection"
                            checked={
                              advancedSearchForm.caseSearchByName
                                .countryType === ALL_SELECTION
                            }
                            className="usa-radio__input"
                            data-testid="all-country-selection"
                            id="all-country-selection"
                            name="country"
                            type="radio"
                            value={ALL_SELECTION}
                            onChange={e => {
                              updateCaseAdvancedSearchByNameFormValueSequence({
                                key: 'countryType',
                                value: e.target.value,
                              });
                            }}
                          />
                          <label
                            className="usa-radio__label"
                            htmlFor="all-country-selection"
                            id="all-country-selection-label"
                          >
                            All
                          </label>
                        </div>
                        <div className="usa-radio margin-bottom-1">
                          <input
                            aria-describedby="scan-mode-radios-legend"
                            aria-labelledby="upload-mode-upload"
                            checked={
                              advancedSearchForm.caseSearchByName
                                .countryType === 'domestic'
                            }
                            className="usa-radio__input"
                            id="united-states-country-selection"
                            name="country"
                            type="radio"
                            value="United States"
                            onChange={e => {
                              updateCaseAdvancedSearchByNameFormValueSequence({
                                key: 'countryType',
                                value: e.target.value,
                              });
                            }}
                          />
                          <label
                            className="usa-radio__label"
                            htmlFor="united-states-country-selection"
                            id="united-states-country-selection-label"
                          >
                            United States
                          </label>
                        </div>
                        <div className="usa-radio margin-bottom-1">
                          <input
                            aria-describedby="scan-mode-radios-legend"
                            aria-labelledby="upload-mode-upload"
                            checked={
                              advancedSearchForm.caseSearchByName
                                .countryType === 'international'
                            }
                            className="usa-radio__input"
                            id="international-country-selection"
                            name="country"
                            type="radio"
                            value="international"
                            onChange={e => {
                              updateCaseAdvancedSearchByNameFormValueSequence({
                                key: 'countryType',
                                value: e.target.value,
                              });
                            }}
                          />
                          <label
                            className="usa-radio__label"
                            htmlFor="international-country-selection"
                            id="international-country-selection-label"
                          >
                            International
                          </label>
                        </div>
                      </Mobile>
                    </fieldset>
                  </FormGroup>

                  {advancedSearchHelper.showStateSelect && (
                    <>
                      <NonMobile>
                        <div className="tablet:grid-col-5 margin-bottom-4">
                          <label
                            className="usa-label"
                            htmlFor="petitioner-state"
                          >
                            State
                          </label>
                          <BindedSelect
                            aria-describedby="case-search-by-name"
                            bind="advancedSearchForm.caseSearchByName.petitionerState"
                            id="petitioner-state"
                            name="petitionerState"
                          >
                            <option value="">- Select -</option>
                            <optgroup label="State">
                              {Object.keys(usStates).map(abbrev => {
                                return (
                                  <option key={abbrev} value={abbrev}>
                                    {usStates[abbrev]}
                                  </option>
                                );
                              })}
                            </optgroup>
                            <optgroup label="Other">
                              {Object.keys(usStatesOther).map(abbrev => {
                                return (
                                  <option key={abbrev} value={abbrev}>
                                    {usStatesOther[abbrev]}
                                  </option>
                                );
                              })}
                            </optgroup>
                          </BindedSelect>
                        </div>
                      </NonMobile>
                      <Mobile>
                        <div className="tablet:grid-col-5 margin-bottom-3">
                          <label
                            className="usa-label"
                            htmlFor="petitioner-state"
                          >
                            State
                          </label>
                          <BindedSelect
                            aria-describedby="case-search-by-name"
                            bind="advancedSearchForm.caseSearchByName.petitionerState"
                            id="petitioner-state"
                            name="petitionerState"
                          >
                            <option value="">- Select -</option>
                            <optgroup label="State">
                              {Object.keys(usStates).map(abbrev => {
                                return (
                                  <option key={abbrev} value={abbrev}>
                                    {usStates[abbrev]}
                                  </option>
                                );
                              })}
                            </optgroup>
                            <optgroup label="Other">
                              {Object.keys(usStatesOther).map(abbrev => {
                                return (
                                  <option key={abbrev} value={abbrev}>
                                    {usStatesOther[abbrev]}
                                  </option>
                                );
                              })}
                            </optgroup>
                          </BindedSelect>
                        </div>
                      </Mobile>
                    </>
                  )}
                </div>
              </div>
            </div>

            <NonMobile>
              <div className="grid-row grid-gap">
                <DateRangePickerComponent
                  omitFormGroupClass
                  endDateErrorText={validationErrors.endDate}
                  endLabel="Date filed end date"
                  endName="caseSearchByNameEndDate"
                  endPickerCls={
                    'desktop:grid-col-6  phone:grid-col-12 desktop:padding-left-2'
                  }
                  endValue={advancedSearchForm.caseSearchByName.endDate}
                  formGroupCls={'margin-bottom-0'}
                  maxDate={caseSearchByNameHelper.today}
                  rangePickerCls={'grid-row grid-gap-3'}
                  showDateHint={true}
                  startDateErrorText={validationErrors.startDate}
                  startLabel="Date filed start date"
                  startName="caseSearchByNameStartDate"
                  startPickerCls={
                    'desktop:grid-col-6  phone:grid-col-12 padding-right-2'
                  }
                  startValue={advancedSearchForm.caseSearchByName.startDate}
                  onChangeEnd={e => {
                    updateCaseAdvancedSearchByNameFormValueSequence({
                      key: 'endDate',
                      value: e.target.value,
                    });
                  }}
                  onChangeStart={e => {
                    updateCaseAdvancedSearchByNameFormValueSequence({
                      key: 'startDate',
                      value: e.target.value,
                    });
                  }}
                />
              </div>
            </NonMobile>

            <Mobile>
              <div className="grid-row grid-gap">
                <DateRangePickerComponent
                  omitFormGroupClass
                  endDateErrorText={validationErrors.endDate}
                  endLabel="Date filed end date"
                  endName="caseSearchByNameEndDate"
                  endPickerCls={
                    'desktop:grid-col-6  phone:grid-col-12 desktop:padding-left-2'
                  }
                  endValue={advancedSearchForm.caseSearchByName.endDate}
                  formGroupCls={'margin-bottom-0'}
                  maxDate={caseSearchByNameHelper.today}
                  rangePickerCls={'grid-row grid-gap-3'}
                  showDateHint={true}
                  startDateErrorText={validationErrors.startDate}
                  startLabel="Date filed start date"
                  startName="caseSearchByNameStartDate"
                  startPickerCls={
                    'desktop:grid-col-6  phone:grid-col-12 padding-right-2'
                  }
                  startValue={advancedSearchForm.caseSearchByName.startDate}
                  onChangeEnd={e => {
                    updateCaseAdvancedSearchByNameFormValueSequence({
                      key: 'endDate',
                      value: e.target.value,
                    });
                  }}
                  onChangeStart={e => {
                    updateCaseAdvancedSearchByNameFormValueSequence({
                      key: 'startDate',
                      value: e.target.value,
                    });
                  }}
                />
              </div>
            </Mobile>

            <div>
              <fieldset className="usa-fieldset">
                <legend className="usa-legend">Case procedure</legend>
                {caseSearchByNameHelper.caseProcedureOptions.map(
                  procedureType => (
                    <div
                      className="usa-radio tablet:display-inline tablet:padding-right-4"
                      key={procedureType.value}
                    >
                      <input
                        checked={
                          advancedSearchForm.caseSearchByName.procedureType ===
                          procedureType.value
                        }
                        className="usa-radio__input"
                        id={`caseProcedureType-${procedureType.value}`}
                        name="procedureType"
                        type="radio"
                        onChange={e => {
                          updateCaseAdvancedSearchByNameFormValueSequence({
                            key: 'procedureType',
                            value: e.target.value,
                          });
                        }}
                        value={procedureType.value}
                      />
                      <label
                        className="usa-radio__label"
                        htmlFor={`caseProcedureType-${procedureType.value}`}
                      >
                        {procedureType.label}
                      </label>
                    </div>
                  ),
                )}
              </fieldset>
            </div>
            <div>
              <label
                className="usa-label"
                htmlFor="case-type-filter"
                id="case-type-filter-label"
              >
                Case type (i.e., docket suffix)
              </label>
              <SelectSearch
                aria-labelledby="case-type-filter-label"
                data-testid="case-type-selection"
                name="caseType"
                className="maxw-mobile-lg"
                placeholder={MULTI_SELECT_PLACEHOLDER}
                inputId="case-type-filter"
                value={{
                  label: MULTI_SELECT_PLACEHOLDER,
                  value: '',
                }}
                options={
                  caseSearchByNameHelper.caseTypeOptions as {
                    label: string;
                    value: string;
                  }[]
                }
                onChange={e => {
                  if (e?.value) {
                    const currentCaseTypeFilters =
                      advancedSearchForm.caseSearchByName?.caseTypes || {};
                    updateCaseAdvancedSearchByNameFormValueSequence({
                      key: 'caseTypes',
                      value: { ...currentCaseTypeFilters, [e.label]: e.value },
                    });
                  }
                }}
              />
            </div>
            {!isEmpty(advancedSearchForm.caseSearchByName?.caseTypes) && (
              <div className="padding-1"></div>
            )}
            <div>
              {Object.entries(
                advancedSearchForm.caseSearchByName?.caseTypes || {},
              ).map(([label, _caseType]: [string, any]) => (
                <PillButton
                  key={label}
                  text={label}
                  onRemove={() => {
                    delete advancedSearchForm.caseSearchByName.caseTypes[label];
                    updateCaseAdvancedSearchByNameFormValueSequence({
                      key: 'caseTypes',
                      value: advancedSearchForm.caseSearchByName.caseTypes,
                    });
                  }}
                />
              ))}
            </div>
            <div className="padding-2"></div>

            <div className="grid-row">
              <div className="button-container">
                <Button
                  type="submit"
                  overrideMargin
                  aria-describedby="case-search-by-name"
                  className="margin-bottom-0"
                  data-testid="submit-case-search-by-name-button"
                  id="advanced-search-button"
                  onClick={e => {
                    e.preventDefault();
                    submitAdvancedSearchSequence();
                  }}
                >
                  Search
                </Button>
                <Button
                  type="reset"
                  link
                  overrideMargin
                  aria-describedby="case-search-by-name"
                  className="margin-bottom-0 mobile:margin-top-2 tablet:margin-top-0 tablet:margin-left-205"
                  onClick={e => {
                    e.preventDefault();
                    clearAdvancedSearchFormSequence({
                      formType: 'caseSearchByName',
                    });
                  }}
                >
                  Clear Search
                </Button>
              </div>
            </div>
          </form>
        </div>
      </>
    );
  },
);

CaseSearchByName.displayName = 'CaseSearchByName';
