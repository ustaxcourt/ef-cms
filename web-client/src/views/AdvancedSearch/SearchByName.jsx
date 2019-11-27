import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { Button } from '../../ustc-ui/Button/Button';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SearchByName = connect(
  {
    advancedSearchForm: state.advancedSearchForm,
    advancedSearchHelper: state.advancedSearchHelper,
    clearAdvancedSearchFormSequence: sequences.clearAdvancedSearchFormSequence,
    constants: state.constants,
    updateAdvancedSearchFormValueSequence:
      sequences.updateAdvancedSearchFormValueSequence,
    usStates: state.constants.US_STATES,
    validationErrors: state.validationErrors,
  },
  ({
    advancedSearchForm,
    advancedSearchHelper,
    clearAdvancedSearchFormSequence,
    constants,
    submitAdvancedSearchSequence,
    updateAdvancedSearchFormValueSequence,
    usStates,
    validationErrors,
  }) => {
    return (
      <>
        <div className="header-with-blue-background display-flex flex-justify">
          <h3>Search by Name</h3>
          <NonMobile>
            <Button
              link
              className="margin-left-1 tablet:margin-left-205 margin-right-0 padding-0 ustc-button--mobile-inline"
              icon={['fas', 'times-circle']}
              onClick={() => {
                clearAdvancedSearchFormSequence();
              }}
            >
              Clear search
            </Button>
          </NonMobile>
        </div>
        <div className="blue-container advanced-search__form-container">
          <form
            onSubmit={e => {
              e.preventDefault();
              submitAdvancedSearchSequence();
            }}
          >
            <div className="grid-row grid-gap">
              <div className="tablet:grid-col-6">
                <FormGroup errorText={validationErrors.petitionerName}>
                  <label className="usa-label" htmlFor="petitioner-name">
                    Petitioner name <span className="usa-hint">(required)</span>
                  </label>
                  <input
                    className="usa-input"
                    id="petitioner-name"
                    name="petitionerName"
                    type="text"
                    value={advancedSearchForm.petitionerName || ''}
                    onChange={e => {
                      updateAdvancedSearchFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </FormGroup>
              </div>

              <div className="tablet:grid-col-6">
                <FormGroup
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
                        aria-describedby="year-filed-legend"
                        aria-label="starting year, four digits"
                        className="usa-input"
                        id="year-filed-min"
                        name="yearFiledMin"
                        type="text"
                        value={advancedSearchForm.yearFiledMin || ''}
                        onChange={e => {
                          updateAdvancedSearchFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <span className="margin-right-2">to</span>
                    <div className="usa-form-group--year display-inline-block">
                      <input
                        aria-describedby="year-filed-legend"
                        aria-label="ending year, four digits"
                        className="usa-input"
                        id="year-filed-max"
                        name="yearFiledMax"
                        type="text"
                        value={advancedSearchForm.yearFiledMax || ''}
                        onChange={e => {
                          updateAdvancedSearchFormValueSequence({
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

            <div className="grid-row grid-gap">
              <div className="tablet:grid-col-8">
                <div className="grid-row grid-gap">
                  <div className="tablet:grid-col-7">
                    <label className="usa-label" htmlFor="country-type">
                      Country
                    </label>
                    <BindedSelect
                      bind="advancedSearchForm.countryType"
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
                        bind="advancedSearchForm.petitionerState"
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
                          <option value="AA">AA</option>
                          <option value="AE">AE</option>
                          <option value="AP">AP</option>
                          <option value="AS">AS</option>
                          <option value="FM">FM</option>
                          <option value="GU">GU</option>
                          <option value="MH">MH</option>
                          <option value="MP">MP</option>
                          <option value="PW">PW</option>
                          <option value="PR">PR</option>
                          <option value="VI">VI</option>
                        </optgroup>
                      </BindedSelect>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid-row">
              <div className="tablet:grid-col-5">
                <Button
                  className="advanced-search__button"
                  id="advanced-search-button"
                  type="submit"
                >
                  Search
                </Button>
              </div>
            </div>

            <Mobile>
              <div className="grid-row">
                <div className="tablet:grid-col-5 text-center">
                  <Button
                    link
                    className="margin-left-1 tablet:margin-left-205 margin-right-0 padding-0 ustc-button--mobile-inline"
                    icon={['fas', 'times-circle']}
                    onClick={() => {
                      clearAdvancedSearchFormSequence();
                    }}
                  >
                    Clear search
                  </Button>
                </div>
              </div>
            </Mobile>
          </form>
        </div>
      </>
    );
  },
);
