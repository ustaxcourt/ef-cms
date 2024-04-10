import { Button } from '@web-client/ustc-ui/Button/Button';
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
    removeFactOrReasonSequence: sequences.removeFactOrReasonSequence,
    textName: props.textName,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  function PetitionFormResponse({
    count,
    form,
    id,
    removeFactOrReasonSequence,
    textName,
    updateFormValueSequence,
  }) {
    return (
      <div className="fact-or-reason">
        {/* TODO: move to scss */}
        <li
          style={{
            fontWeight: 'bold',
            height: '5rem',
            listStyleType: 'lower-alpha',
            verticalAlign: 'top',
            // marginRight: '1rem',
          }}
        >
          <textarea
            aria-describedby={`${id}-label`}
            className="usa-textarea max-width-unset"
            id={id}
            name={textName}
            // style={{ verticalAlign: 'top' }}
            value={form[textName][count] || ''}
            onChange={e => {
              updateFormValueSequence({
                index: count,
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
          {count > 0 && (
            <Button
              link
              className="reason-button"
              icon="times"
              onClick={() =>
                removeFactOrReasonSequence({
                  index: count,
                  key: 'petitionReasons',
                })
              }
            >
              Remove
            </Button>
          )}
        </li>
      </div>
    );
  },
);

PetitionFormResponse.displayName = 'PetitionFormResponse';
