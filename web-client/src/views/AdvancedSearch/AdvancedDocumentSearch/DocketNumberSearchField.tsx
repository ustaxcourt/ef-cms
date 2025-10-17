import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import React from 'react';

export const DocketNumberSearchField = connect(
  {
    searchValue: (props as { searchValue: string }).searchValue,
    updateSequence: (props as { updateSequence: Function }).updateSequence,
    validateSequence: (props as { validateSequence: Function })
      .validateSequence,
  },
  function DocketNumberSearchField({
    searchValue,
    updateSequence,
    validateSequence,
  }: {
    searchValue: string;
    updateSequence: (params: { key: string; value: string }) => void;
    validateSequence: () => void;
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
