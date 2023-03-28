import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';

export const EConsent = connect(
  {
    bind: props.bind,
    contactType: props.contactType,
    data: state[props.bind],
    updateFormValueAndSecondaryContactInfoSequence:
      sequences.updateFormValueAndSecondaryContactInfoSequence,
  },
  function EConsent({
    contactType,
    data,
    updateFormValueAndSecondaryContactInfoSequence,
  }) {
    return (
      <FormGroup className="grid-col-4">
        <input
          checked={data[contactType].hasConsentedToEService || false}
          className="usa-checkbox__input"
          id={`electronic-service-consent-${contactType}`}
          name={`${contactType}.hasConsentedToEService`}
          type="checkbox"
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
