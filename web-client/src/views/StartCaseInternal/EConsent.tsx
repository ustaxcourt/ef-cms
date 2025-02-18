import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { props as cerebralProps } from 'cerebral';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

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
  }) {
    return (
      <FormGroup className="grid-col-4">
        <input
          checked={data[contactType].hasConsentedToElectronicService || false}
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
