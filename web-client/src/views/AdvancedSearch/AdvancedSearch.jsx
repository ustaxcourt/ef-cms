import { BigHeader } from '../BigHeader';
import { SearchResults } from './SearchResults';
import { StateSelect } from './StateSelect';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const AdvancedSearch = connect(
  {
    constants: state.constants,
    form: state.form,
    submitAdvancedSearchSequence: sequences.submitAdvancedSearchSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  ({
    constants,
    form,
    submitAdvancedSearchSequence,
    updateFormValueSequence,
  }) => {
    return (
      <>
        <BigHeader text="Advanced Search" />

        <section className="usa-section grid-container advanced-search">
          <div className="header-with-blue-background">
            <h3>Enter Search Criteria</h3>
          </div>
          <div className="blue-container">
            <div className="grid-row grid-gap">
              <div className="grid-col-4 right-gray-border">
                <label className="usa-label" htmlFor="petitionerName">
                  Petitioner name <span className="usa-hint">(required)</span>
                </label>
                <input
                  className="usa-input"
                  id="petitioner-name"
                  name="petitionerName"
                  type="text"
                  value={form.petitionerName || ''}
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                />
              </div>

              <div className="grid-col-4 right-gray-border">
                <div className="grid-row grid-gap">
                  <div className="grid-col-7">
                    <label className="usa-label" htmlFor="country-type">
                      Country
                    </label>
                    <select
                      className="usa-select"
                      id="country-type"
                      name="countryType"
                      value={form.countryType}
                      onChange={e => {
                        updateFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                      }}
                    >
                      <option value={constants.COUNTRY_TYPES.DOMESTIC}>
                        - United States -
                      </option>
                      <option value={constants.COUNTRY_TYPES.INTERNATIONAL}>
                        - International -
                      </option>
                    </select>
                  </div>

                  <div className="grid-col-5">
                    <label className="usa-label" htmlFor="petitioner-state">
                      State
                    </label>
                    <StateSelect
                      bind={form.petitionerState}
                      updateFormValueSequence={updateFormValueSequence}
                    />
                  </div>
                </div>
              </div>

              <div className="grid-col-4">
                <div className="grid-row grid-gap">
                  <div className="grid-col-7">
                    <label className="display-block" htmlFor="year-filed">
                      Year filed
                    </label>
                    <div className="usa-form-group--year display-inline-block">
                      <input
                        className="usa-input"
                        id="year-filed-min"
                        name="yearFiledMin"
                        type="text"
                        value={form.yearFiledMin || ''}
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <span className="margin-right-2">to</span>
                    <div className="usa-form-group--year display-inline-block">
                      <input
                        className="usa-input"
                        id="year-filed-max"
                        name="yearFiledMax"
                        type="text"
                        value={form.yearFiledMax || ''}
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid-col-5">
                    <button
                      className="usa-button advanced-search__button"
                      onClick={() => submitAdvancedSearchSequence()}
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <SearchResults />
        </section>
      </>
    );
  },
);
