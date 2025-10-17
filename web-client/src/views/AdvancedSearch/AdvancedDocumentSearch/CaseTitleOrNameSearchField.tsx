import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import React from 'react';

export const CaseTitleOrNameSearchField = connect(
  {
    searchValue: (props as { searchValue: string }).searchValue,
    updateSequence: (props as { updateSequence: Function }).updateSequence,
    validateSequence: (props as { validateSequence: Function })
      .validateSequence,
  },
  function CaseTitleOrNameSearchField({
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
        <div>
          <label className="usa-label text-no-wrap" htmlFor="title-or-name">
            Case title / Petitioner’s name
          </label>
          <input
            className="usa-input"
            id="title-or-name"
            name="caseTitleOrPetitioner"
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
        </div>
      </>
    );
  },
);

CaseTitleOrNameSearchField.displayName = 'CaseTitleOrNameSearchField';
