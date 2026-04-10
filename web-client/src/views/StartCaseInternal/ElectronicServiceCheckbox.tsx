import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props as cerebralProps, state } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import React from 'react';

type ElectronicServiceConsentCheckboxProps = {
  bind: string;
  contactType: string;
};
const electronicServiceConsentCheckboxDeps = {
  bind: cerebralProps.bind,
  contactType: cerebralProps`contactType`,
  data: state[cerebralProps`bind`],
  updateFormValueSequence: sequences.updateFormValueSequence,
};

export const ElectronicServiceConsentCheckbox = connect<
  ElectronicServiceConsentCheckboxProps,
  typeof electronicServiceConsentCheckboxDeps
>(
  electronicServiceConsentCheckboxDeps,
  function ElectronicServiceConsentCheckbox({
    contactType,
    data,
    updateFormValueSequence,
  }: {
    contactType: string;
    data: any;
    updateFormValueSequence: Function;
  }): React.JSX.Element {
    return (
      <FormGroup
        className="max-width-fit-content margin-bottom-4"
        omitFormGroupClass={true}
      >
        <input
          checked={data[contactType].hasConsentedToElectronicService || false}
          className="usa-checkbox__input"
          id={`electronic-service-consent-${contactType}`}
          name={`${contactType}.hasConsentedToElectronicService`}
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
