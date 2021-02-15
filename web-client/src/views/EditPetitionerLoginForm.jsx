import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';

export const EditPetitionerLoginForm = connect(
  {
    form: state.form,
    type: props.type,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state[props.validationErrors],
  },
  function EditPetitionerLoginForm({
    form,
    type,
    updateFormValueSequence,
    validationErrors,
  }) {
    return (
      <>
        <h4>Add Login &amp; Service Email</h4>
        <FormGroup
          errorText={
            validationErrors &&
            validationErrors[type] &&
            validationErrors[type].updatedEmail
          }
        >
          <label className="usa-label" htmlFor={`${type}.updatedEmail`}>
            New email address
          </label>
          <input
            autoCapitalize="none"
            className="usa-input"
            id={`${type}.updatedEmail`}
            name={`${type}.updatedEmail`}
            type="text"
            value={form[type].updatedEmail || ''}
            onBlur={() => {
              // validation sequence
            }}
            onChange={e =>
              updateFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              })
            }
          />
        </FormGroup>
        <FormGroup
          errorText={
            validationErrors &&
            validationErrors[type] &&
            validationErrors[type].confirmEmail
          }
        >
          <label className="usa-label" htmlFor={`${type}.confirmEmail`}>
            Re-enter new email address
          </label>
          <input
            autoCapitalize="none"
            className="usa-input"
            id={`${type}.confirmEmail`}
            name={`${type}.confirmEmail`}
            type="text"
            value={form[type].confirmEmail || ''}
            onBlur={() => {
              // validation sequence
            }}
            onChange={e =>
              updateFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              })
            }
          />
        </FormGroup>
      </>
    );
  },
);
