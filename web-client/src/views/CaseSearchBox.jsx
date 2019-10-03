import { Button } from '../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CaseSearchBox = connect(
  {
    searchTerm: state.searchTerm,
    submitCaseSearchSequence: sequences.submitCaseSearchSequence,
    updateSearchTermSequence: sequences.updateSearchTermSequence,
  },
  ({ searchTerm, submitCaseSearchSequence, updateSearchTermSequence }) => {
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
                <div className="grid-row underlined">
                  <div className="  grid-col-8">
                    <h3>Search for a Case</h3>
                  </div>
                  <div className="tablet:grid-col-4 padding-top-05">
                    <a className="usa-link float-right" href="/search">
                      Advanced Search
                    </a>
                  </div>
                </div>
                <p>
                  To file an Entry of appearance, Substitution of counsel, etc.
                </p>
                <div className="usa-form-group margin-bottom-4">
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

                <Button secondary type="submit">
                  <span className="usa-search-submit-text">Search</span>
                </Button>
              </div>
            </div>
          </div>
        </form>
      </>
    );
  },
);
