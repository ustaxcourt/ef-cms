import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import React from 'react';

export const CaseTitleOrNameSearchField = connect(
  {
    searchValue: props.searchValue,
    updateSequence: props.updateSequence,
    validateSequence: props.validateSequence,
  },
  function CaseTitleOrNameSearchField({
    searchValue,
    updateSequence,
    validateSequence,
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
