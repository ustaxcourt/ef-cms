import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import React from 'react';

type KeywordSearchFieldProps = {
  searchValue: string;
  updateSequence: Function;
  validateSequence: Function;
}

export const KeywordSearchField: React.FC<KeywordSearchFieldProps> = connect(
  {
    searchValue: props`searchValue`,
    updateSequence: props`updateSequence`,
    validateSequence: props`validateSequence`,
  },
  function KeywordSearchField({
    searchValue,
    updateSequence,
    validateSequence,
  }) {
    return (
      <>
        <p className="margin-top-0">
          <span className="text-semibold">Search by keyword and phrase</span>
        </p>
        <input
          aria-describedby="search-keywords-header search-description"
          aria-label="keyword-search"
          className="usa-input maxw-tablet-lg"
          data-testid="keyword-search-input"
          id="keyword-search"
          name="keyword"
          type="text"
          value={searchValue || ''}
          onBlur={() => validateSequence()}
          onChange={e => {
            updateSequence({
              key: e.target.name,
              value: e.target.value,
            });
          }}
        />
      </>
    );
  },
);

KeywordSearchField.displayName = 'KeywordSearchField';
