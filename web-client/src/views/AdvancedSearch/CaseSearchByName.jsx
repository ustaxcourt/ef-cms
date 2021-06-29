import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { Button } from '../../ustc-ui/Button/Button';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CaseSearchByName = connect(
  {
    advancedSearchForm: state.advancedSearchForm,
    advancedSearchHelper: state.advancedSearchHelper,
    clearAdvancedSearchFormSequence: sequences.clearAdvancedSearchFormSequence,
    constants: state.constants,
    updateAdvancedSearchFormValueSequence:
      sequences.updateAdvancedSearchFormValueSequence,
    usStates: state.constants.US_STATES,
    usStatesOther: state.constants.US_STATES_OTHER,
    validateCaseAdvancedSearchFormSequence:
      sequences.validateCaseAdvancedSearchFormSequence,
    validationErrors: state.validationErrors,
  },
  function CaseSearchByName({
    advancedSearchForm,
    advancedSearchHelper,
    clearAdvancedSearchFormSequence,
    constants,
    submitAdvancedSearchSequence,
    updateAdvancedSearchFormValueSequence,
    usStates,
    usStatesOther,
    validateCaseAdvancedSearchFormSequence,
    validationErrors,
  }) {
    return (
      <>
        <div
          className="header-with-blue-background display-flex flex-justify"
          id="case-search-by-name"
        >
          <h3>Search by Name</h3>
        </div>
        <div className="blue-container advanced-search__form-container">
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
              <div className="tablet:grid-col-7">
                <div className="grid-row grid-gap">
                  <div className="tablet:grid-col-7">
                    <label className="usa-label" htmlFor="country-type">
                      Country
                    </label>
                    <BindedSelect
                      aria-describedby="case-search-by-name"
                      bind="advancedSearchForm.caseSearchByName.countryType"
                      id="country-type"
                      name="countryType"
                    >
                      <option value={constants.COUNTRY_TYPES.DOMESTIC}>
                        - United States -
                      </option>
                      <option value={constants.COUNTRY_TYPES.INTERNATIONAL}>
                        - International -
                      </option>
                    </BindedSelect>
                  </div>

                  {advancedSearchHelper.showStateSelect && (
                    <div className="tablet:grid-col-5">
                      <label className="usa-label" htmlFor="petitioner-state">
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
                          {usStatesOther.map(abbrev => {
                            return (
                              <option key={abbrev} value={abbrev}>
                                {abbrev}
                              </option>
                            );
                          })}
                        </optgroup>
                      </BindedSelect>
                    </div>
                  )}
                </div>
              </div>
              <div className="tablet:grid-col-5">
                <FormGroup
                  className="margin-top-0"
                  errorText={[
                    validationErrors.yearFiledMin,
                    validationErrors.yearFiledMax,
                  ]}
                >
                  <fieldset className="usa-fieldset margin-bottom-0">
                    <legend className="display-block" id="year-filed-legend">
                      Year filed
                    </legend>
                    <div className="usa-form-group--year display-inline-block">
                      <input
                        aria-describedby="case-search-by-name year-filed-legend"
                        aria-label="starting year, four digits"
                        className="usa-input"
                        id="year-filed-min"
                        name="yearFiledMin"
                        type="text"
                        value={
                          advancedSearchForm.caseSearchByName.yearFiledMin || ''
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
                    </div>
                    <span className="margin-right-2">to</span>
                    <div className="usa-form-group--year display-inline-block">
                      <input
                        aria-describedby="case-search-by-name year-filed-legend"
                        aria-label="ending year, four digits"
                        className="usa-input"
                        id="year-filed-max"
                        name="yearFiledMax"
                        type="text"
                        value={
                          advancedSearchForm.caseSearchByName.yearFiledMax || ''
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
                    </div>
                  </fieldset>
                </FormGroup>
              </div>
            </div>

            <div className="grid-row">
              <div className="tablet:grid-col-6">
                <Button
                  aria-describedby="case-search-by-name"
                  className="advanced-search__button"
                  id="advanced-search-button"
                  onClick={e => {
                    e.preventDefault();
                    submitAdvancedSearchSequence();
                  }}
                >
                  Search
                </Button>
                <Button
                  link
                  aria-describedby="case-search-by-name"
                  className="margin-left-1 tablet:margin-left-205 margin-right-0 padding-0 ustc-button--mobile-inline"
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
