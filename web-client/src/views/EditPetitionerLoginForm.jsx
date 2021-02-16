import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';

export const EditPetitionerLoginForm = connect(
  {
    form: state.form,
    type: props.type,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateChangePetitionerLoginAndServiceEmailSequence:
      sequences.validateChangePetitionerLoginAndServiceEmailSequence,
    validationErrors: state.validationErrors,
  },
  function EditPetitionerLoginForm({
    form,
    type,
    updateFormValueSequence,
    validateChangePetitionerLoginAndServiceEmailSequence,
    validationErrors,
  }) {
    return (
      <>
        <h4>Add Login &amp; Service Email</h4>
        <FormGroup
          errorText={
            validationErrors &&
            validationErrors[type] &&
            validationErrors[type].email
          }
        >
          <label className="usa-label" htmlFor={`${type}.email`}>
            New email address
          </label>
          <input
            autoCapitalize="none"
            className="usa-input"
            id={`${type}.email`}
            name={`${type}.email`}
            type="text"
            value={form[type].email || ''}
            onBlur={() => {
              validateChangePetitionerLoginAndServiceEmailSequence();
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
              validateChangePetitionerLoginAndServiceEmailSequence();
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
