import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CaseSearchBox = connect(
  {
    form: state.form,
    searchTerm: state.searchTerm,
    submitCaseSearchSequence: sequences.submitCaseSearchSequence,
    updateSearchTermSequence: sequences.updateSearchTermSequence,
  },
  ({
    form,
    searchTerm,
    submitCaseSearchSequence,
    updateSearchTermSequence,
  }) => {
    return (
      <>
        <form
          onSubmit={e => {
            e.preventDefault();
            submitCaseSearchSequence();
          }}
        >
          <div className="case-search margin-bottom-4">
            <div className="card">
              <div className="content-wrapper gray">
                <h3>Search for a Case</h3>
                <hr />
                <p>
                  To file an Entry of Appearance, Substitution of Counsel, etc.
                </p>
                <div
                  className={`usa-form-group margin-bottom-0 ${
                    form.searchError ? 'usa-form-group--error' : ''
                  }`}
                >
                  <div>
                    <label className="usa-label" htmlFor="docket-search-field">
                      Docket Number
                    </label>
                    <input
                      className="usa-input"
                      id="docket-search-field"
                      name="searchTerm"
                      type="text"
                      value={searchTerm}
                      onChange={e => {
                        updateSearchTermSequence({
                          searchTerm: e.target.value,
                        });
                      }}
                    />
                  </div>

                  {form.searchError && (
                    <div className="usa-error-message">
                      No case was found. Check your docket number and try again.
                    </div>
                  )}
                </div>
                <button
                  className="usa-button usa-button--outline margin-top-2"
                  type="submit"
                >
                  <span className="usa-search-submit-text">Search</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </>
    );
  },
);
