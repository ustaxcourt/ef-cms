import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CaseSearchBox = connect(
  {
    form: state.form,
    searchTerm: state.searchTerm,
    submitSearchSequence: sequences.submitSearchSequence,
    updateSearchTermSequence: sequences.updateSearchTermSequence,
  },
  ({ form, searchTerm, submitSearchSequence, updateSearchTermSequence }) => {
    return (
      <div className="one-third-searchbox">
        <form
          onSubmit={e => {
            e.preventDefault();
            submitSearchSequence();
          }}
        >
          <p className="lead bold">Search For a Case</p>
          <p>To file an Entry of Appearance, Substitution of Counsel, etc.</p>
          <fieldset className={form.searchError && 'usa-input-error'}>
            <label htmlFor="docket-search-field">Docket Number</label>
            <input
              id="docket-search-field"
              type="text"
              name="searchTerm"
              value={searchTerm}
              onChange={e => {
                updateSearchTermSequence({
                  searchTerm: e.target.value,
                });
              }}
            />
            <p className="usa-input-error-message">
              No case was found. Check your docket number and try again.
            </p>
          </fieldset>
          <button type="submit" className="usa-button-secondary">
            <span className="usa-search-submit-text">Search</span>
          </button>
        </form>
      </div>
    );
  },
);
