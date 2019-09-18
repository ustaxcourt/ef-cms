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
                <div className="usa-form-group margin-bottom-2">
                  <div>
                    <label className="usa-label" htmlFor="docket-search-field">
                      Docket number
                    </label>
                    <input
                      className="usa-input"
                      id="docket-search-field"
                      name="searchTerm"
                      placeholder="Enter docket number (e.g., 123-19)"
                      type="text"
                      value={searchTerm}
                      onChange={e => {
                        updateSearchTermSequence({
                          searchTerm: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>

                <div className="margin-bottom-3">
                  <a href="/search">Advanced Search</a>
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
