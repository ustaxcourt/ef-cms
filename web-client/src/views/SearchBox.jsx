import { connect } from '@cerebral/react';
import React from 'react';
import { sequences, state } from 'cerebral';

export default connect(
  {
    searchTerm: state.searchTerm,
    submitSearchSequence: sequences.submitSearchSequence,
    updateSearchTermSequence: sequences.updateSearchTermSequence,
  },
  function SearchBox({
    searchTerm,
    submitSearchSequence,
    updateSearchTermSequence,
  }) {
    return (
      <form
        className="usa-search"
        id="search-input"
        noValidate
        onSubmit={e => {
          e.preventDefault();
          submitSearchSequence();
        }}
      >
        <label className="usa-sr-only" htmlFor="search-field">
          Search term
        </label>
        <input
          id="search-field"
          type="search"
          name="searchTerm"
          value={searchTerm}
          onChange={e => {
            updateSearchTermSequence({
              searchTerm: e.target.value,
            });
          }}
        />
        <button type="submit">
          <span className="usa-search-submit-text">Search</span>
        </button>
      </form>
    );
  },
);
