import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SearchBox = connect(
  {
    searchTerm: state.header.searchTerm,
    submitCaseSearchSequence: sequences.submitCaseSearchSequence,
    toggleMobileMenuSequence: sequences.toggleMobileMenuSequence,
    updateSearchTermSequence: sequences.updateSearchTermSequence,
  },
  function SearchBox({
    searchTerm,
    submitCaseSearchSequence,
    toggleMobileMenuSequence,
    updateSearchTermSequence,
  }) {
    return (
      <form
        noValidate
        className="usa-search usa-search--small ustc-search"
        id="search-input"
        onSubmit={e => {
          e.preventDefault();
          submitCaseSearchSequence();
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
                searchTerm: e.target.value.toUpperCase(),
              });
            }}
          />
          <Button className="ustc-search-button" type="submit">
            <span className="usa-search-submit-text">Search</span>
            <span className="usa-sr-only">Search</span>
          </Button>
          <a
            aria-label="advanced search"
            className="usa-link advanced margin-left-105"
            href="/search"
            onClick={() => toggleMobileMenuSequence()}
          >
            Advanced
          </a>
        </div>
      </form>
    );
  },
);

SearchBox.displayName = 'SearchBox';
