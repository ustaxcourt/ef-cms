import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const ModalCaseSearchBox = connect(
  {
    searchTerm: state.modal.searchTerm,
    submitCaseSearchForConsolidationSequence:
      sequences.submitCaseSearchForConsolidationSequence,
    updateModalValueSequence: sequences.updateModalValueSequence,
  },
  function ModalCaseSearchBox({
    searchTerm,
    submitCaseSearchForConsolidationSequence,
    updateModalValueSequence,
  }) {
    return (
      <form
        noValidate
        className="usa-search usa-search--small ustc-search margin-bottom-4"
        id="search-input"
        onSubmit={e => {
          e.preventDefault();
          submitCaseSearchForConsolidationSequence();
        }}
      >
        <div role="search">
          <label className="usa-sr-only" htmlFor="search-field">
            Search term
          </label>
          <input
            className="usa-input"
            data-testid="consolidated-case-search"
            id="search-field"
            name="searchTerm"
            placeholder="Enter docket no. (123-19)"
            type="search"
            value={searchTerm || ''}
            onChange={e => {
              updateModalValueSequence({
                key: 'searchTerm',
                value: e.target.value.toUpperCase(),
              });
            }}
          />
          <Button
            className="ustc-search-button"
            data-testid="consolidated-search"
            type="submit"
          >
            <span className="usa-search-submit-text">Search</span>
          </Button>
        </div>
      </form>
    );
  },
);

ModalCaseSearchBox.displayName = 'ModalCaseSearchBox';
