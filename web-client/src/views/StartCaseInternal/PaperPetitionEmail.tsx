import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props as cerebralProps } from 'cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import { RunableSequence as RunnableSequence } from 'cerebral';

const props = cerebralProps as unknown as {
  bind: string;
  contactType: string;
  onBlur: () => void;
};

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
  }: {
    contactType: string;
    data: Record<string, Record<string, any>>;
    onBlur: () => void;
    updateFormValueAndSecondaryContactInfoSequence: Function | RunnableSequence;
    validationErrors: Record<string, Record<string, any>>;
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
            value={(data[contactType]?.paperPetitionEmail as string) || ''}
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
