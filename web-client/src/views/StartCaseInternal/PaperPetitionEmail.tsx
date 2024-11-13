import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const PaperPetitionEmail = connect(
  {
    bind: props.bind,
    contactType: props.contactType,
    data: state[props.bind],
    onBlur: props.onBlur,
    updateFormValueAndSecondaryContactInfoSequence:
      sequences.updateFormValueAndSecondaryContactInfoSequence,
    validationErrors: state.validationErrors,
  },
  function PaperPetitionEmail({
    contactType,
    data,
    onBlur,
    updateFormValueAndSecondaryContactInfoSequence,
    validationErrors = {},
  }) {
    return (
      <>
        <FormGroup
          errorText={
            validationErrors[contactType] &&
            validationErrors[contactType].paperPetitionEmail
          }
        >
          <label
            className="usa-label"
            htmlFor={`paper-petition-email-${contactType}`}
          >
            Petition email address <span className="usa-hint">(optional)</span>
          </label>
          <input
            className="usa-input"
            id={`paper-petition-email-${contactType}`}
            name={`${contactType}.paperPetitionEmail`}
            type="email"
            value={data[contactType].paperPetitionEmail || ''}
            onBlur={() => {
              onBlur();
            }}
            onChange={e => {
              updateFormValueAndSecondaryContactInfoSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
        </FormGroup>
      </>
    );
  },
);

PaperPetitionEmail.displayName = 'PaperPetitionEmail';
