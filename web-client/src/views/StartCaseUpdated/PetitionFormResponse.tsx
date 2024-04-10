import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const PetitionFormResponse = connect(
  {
    count: props.count,
    form: state.form,
    id: props.id,
    textName: props.textName,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  function PetitionFormResponse({
    count,
    form,
    id,
    textName,
    updateFormValueSequence,
  }) {
    return (
      <li
        style={{
          fontWeight: 'bold',
          listStyleType: 'lower-alpha',
          marginRight: '1rem',
        }}
      >
        <textarea
          aria-describedby={`${id}-label`}
          className="usa-textarea height-8"
          id={id}
          name={textName}
          value={form[textName][count] || ''}
          onChange={e => {
            updateFormValueSequence({
              index: count,
              key: e.target.name,
              value: e.target.value,
            });
          }}
        />
      </li>
    );
  },
);

PetitionFormResponse.displayName = 'PetitionFormResponse';
