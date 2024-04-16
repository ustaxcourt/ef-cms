import { Button } from '@web-client/ustc-ui/Button/Button';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
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
    updatePetitionFormValueSequence: sequences.updatePetitionFormValueSequence,
    validationErrors: state.validationErrors,
  },
  function PetitionFormResponse({
    count,
    form,
    id,
    removeFactOrReasonSequence,
    textName,
    updatePetitionFormValueSequence,
    validationErrors,
  }) {
    return (
      <FormGroup
        className="autogenerate-petition-form"
        errorText={validationErrors[`${textName}[${count}]`]}
      >
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
                updatePetitionFormValueSequence({
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
                    key: textName,
                  })
                }
              >
                Remove
              </Button>
            )}
          </li>
        </div>
      </FormGroup>
    );
  },
);

PetitionFormResponse.displayName = 'PetitionFormResponse';
