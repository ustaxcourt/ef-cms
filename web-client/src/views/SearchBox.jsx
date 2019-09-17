import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SearchBox = connect(
  {
    searchTerm: state.searchTerm,
    submitSearchSequence: sequences.submitSearchSequence,
    updateSearchTermSequence: sequences.updateSearchTermSequence,
  },
  ({ searchTerm, submitSearchSequence, updateSearchTermSequence }) => {
    return (
      <form
        noValidate
        className="usa-search usa-search--small ustc-search"
        id="search-input"
        onSubmit={e => {
          e.preventDefault();
          submitSearchSequence();
        }}
      >
        <div role="search">
          <label className="usa-sr-only" htmlFor="search-field">
            Search term
          </label>
          <input
            className="usa-input"
            id="search-field"
            name="searchTerm"
            placeholder="Enter docket no. (123-19)"
            type="search"
            value={searchTerm}
            onChange={e => {
              updateSearchTermSequence({
                searchTerm: e.target.value,
              });
            }}
          />
          <button className="usa-button ustc-search-button" type="submit">
            <span className="usa-search-submit-text">Search</span>
            <span className="usa-sr-only">Search</span>
          </button>
          <a
            aria-label="advanced search"
            className="usa-link advanced margin-left-2"
            href="/search"
          >
            Advanced
          </a>
        </div>
      </form>
    );
  },
);
