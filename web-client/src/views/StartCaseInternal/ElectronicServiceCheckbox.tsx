import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const ElectronicServiceConsentCheckbox = connect(
  {
    bind: props.bind,
    contactType: props.contactType,
    data: state[props.bind],
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  function ElectronicServiceConsentCheckbox({
    contactType,
    data,
    updateFormValueSequence,
  }) {
    return (
      <FormGroup>
        <input
          checked={data[contactType].hasConsentedToEService || false}
          className="usa-checkbox__input"
          id={`electronic-service-consent-${contactType}`}
          name={`${contactType}.hasConsentedToEService`}
          type="checkbox"
          onChange={e => {
            updateFormValueSequence({
              key: e.target.name,
              value: e.target.checked,
            });
          }}
        />
        <label
          className="usa-checkbox__label"
          htmlFor={`electronic-service-consent-${contactType}`}
        >
          Register email address provided above for electronic filing and
          service
        </label>
      </FormGroup>
    );
  },
);

ElectronicServiceConsentCheckbox.displayName =
  'ElectronicServiceConsentCheckbox';
