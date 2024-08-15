import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from '../../utilities/cerebralWrapper';
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
      <FormGroup
        className="max-width-fit-content margin-bottom-4"
        omitFormGroupClass={true}
      >
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
          data-testid="register-email-address-provided-above-for-electronic-filing-and-service-label"
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
