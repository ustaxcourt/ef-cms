import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import React from 'react';

export const DocketNumberSearchField = connect(
  {
    searchValue: props.searchValue,
    updateSequence: props.updateSequence,
    validateSequence: props.validateSequence,
  },
  function DocketNumberSearchField({
    searchValue,
    updateSequence,
    validateSequence,
  }) {
    return (
      <>
        <label className="usa-label text-no-wrap" htmlFor="docket-number">
          Docket number
        </label>
        <input
          className="usa-input maxw-15"
          id="docket-number"
          name="docketNumber"
          type="text"
          value={searchValue || ''}
          onBlur={() => validateSequence()}
          onChange={e => {
            updateSequence({
              key: e.target.name,
              value: e.target.value.toUpperCase(),
            });
          }}
        />
      </>
    );
  },
);

DocketNumberSearchField.displayName = 'DocketNumberSearchField';
