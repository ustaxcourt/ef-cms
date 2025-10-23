import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { props as cerebralProps } from 'cerebral';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import { RunableSequence as RunnableSequence } from 'cerebral';

const props = cerebralProps as unknown as {
  bind: string;
  contactType: string;
  onBlur: () => void;
};

export const EConsent = connect(
  {
    bind: props.bind,
    contactType: props.contactType,
    data: state[props.bind],
    onBlur: props.onBlur,
    updateFormValueAndSecondaryContactInfoSequence:
      sequences.updateFormValueAndSecondaryContactInfoSequence,
  },
  function EConsent({
    contactType,
    data,
    onBlur,
    updateFormValueAndSecondaryContactInfoSequence,
  }: {
    contactType: string;
    data: Record<string, Record<string, any>>;
    onBlur: () => void;
    updateFormValueAndSecondaryContactInfoSequence: Function | RunnableSequence;
  }) {
    return (
      <FormGroup className="grid-col-4">
        <input
          checked={
            (data[contactType]?.hasConsentedToElectronicService as boolean) ||
            false
          }
          className="usa-checkbox__input"
          id={`electronic-service-consent-${contactType}`}
          name={`${contactType}.hasConsentedToElectronicService`}
          type="checkbox"
          onBlur={onBlur}
          onChange={e => {
            updateFormValueAndSecondaryContactInfoSequence({
              key: e.target.name,
              value: e.target.checked,
            });
          }}
        />
        <label
          className="usa-checkbox__label"
          htmlFor={`electronic-service-consent-${contactType}`}
        >
          E-service consent
        </label>
      </FormGroup>
    );
  },
);

EConsent.displayName = 'EConsent';
