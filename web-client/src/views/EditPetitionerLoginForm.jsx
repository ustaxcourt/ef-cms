import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';

export const EditPetitionerLoginForm = connect(
  {
    form: state.form,
    type: props.type,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validatePetitionerInformationFormSequence:
      sequences.validatePetitionerInformationFormSequence,
    validationErrors: state.validationErrors,
  },
  function EditPetitionerLoginForm({
    form,
    type,
    updateFormValueSequence,
    validatePetitionerInformationFormSequence,
    validationErrors,
  }) {
    return (
      <>
        <h4>Add Login &amp; Service Email</h4>
        <FormGroup errorText={validationErrors?.[type]?.email}>
          <label className="usa-label" htmlFor={`${type}-email`}>
            New email address
          </label>
          <input
            autoCapitalize="none"
            className="usa-input"
            id={`${type}-email`}
            name={`${type}.email`}
            type="text"
            value={form[type].email || ''}
            onBlur={() => {
              validatePetitionerInformationFormSequence();
            }}
            onChange={e =>
              updateFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              })
            }
          />
        </FormGroup>
        <FormGroup errorText={validationErrors?.[type]?.confirmEmail}>
          <label className="usa-label" htmlFor={`${type}-confirmEmail`}>
            Re-enter new email address
          </label>
          <input
            autoCapitalize="none"
            className="usa-input"
            id={`${type}-confirmEmail`}
            name={`${type}.confirmEmail`}
            type="text"
            value={form[type].confirmEmail || ''}
            onBlur={() => {
              validatePetitionerInformationFormSequence();
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
