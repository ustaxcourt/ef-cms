import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
    const mobileSearch = () => {
      return (
        <div className="show-on-mobile">
          <p className="lead bold">Search For a Case</p>
          <div
            className={
              form.searchError
                ? 'usa-input-error usa-input-group'
                : 'usa-input-group'
            }
          >
            <div className="usa-search">
              <label
                htmlFor="docket-search-field-mobile"
                className="usa-sr-only"
              >
                Docket Number
              </label>
              <input
                id="docket-search-field-mobile"
                type="search"
                name="searchTerm"
                className="usa-search-input"
                value={searchTerm}
                onChange={e => {
                  updateSearchTermSequence({
                    searchTerm: e.target.value,
                  });
                }}
              />
              <button type="submit" className="usa-button-primary">
                <span className="usa-sr-only">Search</span>
                <FontAwesomeIcon icon={['fas', 'search']} />
              </button>
            </div>

            <p className="usa-input-error-message">
              No case was found. Check your docket number and try again.
            </p>
          </div>
        </div>
      );
    };
    const desktopSearch = () => {
      return (
        <div className="hide-on-mobile">
          {' '}
          <p className="lead bold">Search For a Case</p>
          <p>To file an Entry of Appearance, Substitution of Counsel, etc.</p>
          <div
            className={
              form.searchError
                ? 'usa-input-error usa-input-group'
                : 'usa-input-group'
            }
          >
            <div>
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
            </div>

            <p className="usa-input-error-message">
              No case was found. Check your docket number and try again.
            </p>
          </div>
          <button type="submit" className="usa-button-secondary">
            <span className="usa-search-submit-text">Search</span>
          </button>
        </div>
      );
    };
    return (
      <div className="one-third-searchbox">
        <form
          onSubmit={e => {
            e.preventDefault();
            submitCaseSearchSequence();
          }}
        >
          {mobileSearch()}
          {desktopSearch()}
        </form>
      </div>
    );
  },
);
