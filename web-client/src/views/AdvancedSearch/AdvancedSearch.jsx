import { BigHeader } from '../BigHeader';
import { ErrorNotification } from '../ErrorNotification';
import { SearchResults } from './SearchResults';
import { StateSelect } from './StateSelect';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const AdvancedSearch = connect(
  {
    advancedSearchHelper: state.advancedSearchHelper,
    constants: state.constants,
    form: state.form,
    submitAdvancedSearchSequence: sequences.submitAdvancedSearchSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    usStates: state.constants.US_STATES,
    validationErrors: state.validationErrors,
  },
  ({
    advancedSearchHelper,
    constants,
    form,
    submitAdvancedSearchSequence,
    updateFormValueSequence,
    usStates,
    validationErrors,
  }) => {
    return (
      <>
        <BigHeader text="Advanced Search" />

        <section className="usa-section grid-container advanced-search">
          <ErrorNotification />

          <div className="header-with-blue-background">
            <h3>Enter Search Criteria</h3>
          </div>
          <div className="blue-container">
            <form
              onSubmit={e => {
                e.preventDefault();
                submitAdvancedSearchSequence();
              }}
            >
              <div className="grid-row grid-gap">
                <div className="grid-col-4 right-gray-border">
                  <div
                    className={classNames(
                      'usa-form-group margin-bottom-0',
                      validationErrors.petitionerName &&
                        'usa-form-group--error',
                    )}
                  >
                    <label className="usa-label" htmlFor="petitioner-name">
                      Petitioner name{' '}
                      <span className="usa-hint">(required)</span>
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
                    <Text
                      bind="validationErrors.petitionerName"
                      className="usa-error-message"
                    />
                  </div>
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

                    {advancedSearchHelper.showStateSelect && (
                      <div className="grid-col-5">
                        <label className="usa-label" htmlFor="petitioner-state">
                          State
                        </label>
                        <StateSelect
                          bind={form.select}
                          updateFormValueSequence={updateFormValueSequence}
                          usStates={usStates}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid-col-4">
                  <div className="grid-row grid-gap">
                    <div className="grid-col-7">
                      <div
                        className={classNames(
                          'usa-form-group margin-bottom-0',
                          (validationErrors.yearFiledMin ||
                            validationErrors.yearFiledMax) &&
                            'usa-form-group--error',
                        )}
                      >
                        <fieldset className="usa-fieldset margin-bottom-0">
                          <legend
                            className="display-block"
                            id="year-filed-legend"
                          >
                            Year filed
                          </legend>
                          <div className="usa-form-group--year display-inline-block">
                            <input
                              aria-describedby="year-filed-label"
                              aria-label="starting year, four digits"
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
                              aria-describedby="year-filed-label"
                              aria-label="ending year, four digits"
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
                          <Text
                            bind="validationErrors.yearFiledMin"
                            className="usa-error-message"
                          />{' '}
                          <Text
                            bind="validationErrors.yearFiledMax"
                            className="usa-error-message"
                          />
                        </fieldset>
                      </div>
                    </div>

                    <div className="grid-col-5">
                      <button
                        className="usa-button advanced-search__button"
                        type="submit"
                      >
                        Search
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <SearchResults />
        </section>
      </>
    );
  },
);
