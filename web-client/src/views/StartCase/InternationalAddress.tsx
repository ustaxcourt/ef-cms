import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const InternationalAddress = connect(
  {
    data: state[props.bind],
    onBlur: props.onBlur,
    onBlurSequence: sequences[props.onBlur],
    type: props.type,
    updateFormValueSequence: sequences[props.onChange],
    usStates: state.constants.US_STATES,
    usStatesOther: state.constants.US_STATES_OTHER,
    validationErrors: state.validationErrors,
  },
  function InternationalAddress({
    data,
    onBlurSequence,
    type,
    updateFormValueSequence,
    validationErrors,
  }) {
    return (
      <>
        <FormGroup errorText={validationErrors?.[type]?.address1}>
          <label className="usa-label" htmlFor={`${type}.address1`}>
            Mailing address line 1
          </label>
          <input
            autoCapitalize="none"
            className="usa-input"
            data-testid={`${type}.address1`}
            id={`${type}.address1`}
            name={`${type}.address1`}
            type="text"
            value={data[type].address1 || ''}
            onBlur={() => {
              onBlurSequence({
                validationKey: [type, 'address1'],
              });
            }}
            onChange={e => {
              updateFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
        </FormGroup>
        <div className="usa-form-group">
          <label className="usa-label" htmlFor={`${type}.address2`}>
            Mailing address line 2 <span className="usa-hint">(optional)</span>
          </label>
          <input
            autoCapitalize="none"
            className="usa-input"
            data-testid={`${type}.address2`}
            id={`${type}.address2`}
            name={`${type}.address2`}
            type="text"
            value={data[type].address2 || ''}
            onBlur={() => {
              onBlurSequence({
                validationKey: [type, 'address2'],
              });
            }}
            onChange={e => {
              updateFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
        </div>{' '}
        <div className="usa-form-group">
          <label className="usa-label" htmlFor={`${type}.address3`}>
            Mailing address line 3 <span className="usa-hint">(optional)</span>
          </label>
          <input
            autoCapitalize="none"
            className="usa-input"
            data-testid={`${type}.address3`}
            id={`${type}.address3`}
            name={`${type}.address3`}
            type="text"
            value={data[type].address3 || ''}
            onBlur={() => {
              onBlurSequence({
                validationKey: [type, 'address3'],
              });
            }}
            onChange={e => {
              updateFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
        </div>
        <FormGroup errorText={validationErrors?.[type]?.state}>
          <label className="usa-label" htmlFor={`${type}.state`}>
            State/Province/Region <span className="usa-hint">(optional)</span>
          </label>
          <input
            autoCapitalize="none"
            className="usa-input"
            data-testid={`${type}.state`}
            id={`${type}.state`}
            name={`${type}.state`}
            type="text"
            value={data[type].state || ''}
            onBlur={() => {
              onBlurSequence({
                validationKey: [type, 'state'],
              });
            }}
            onChange={e => {
              updateFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
        </FormGroup>
        <FormGroup errorText={validationErrors?.[type]?.city}>
          <label className="usa-label" htmlFor={`${type}.city`}>
            City
          </label>
          <input
            autoCapitalize="none"
            className="usa-input"
            data-testid={`${type}.city`}
            id={`${type}.city`}
            name={`${type}.city`}
            type="text"
            value={data[type].city || ''}
            onBlur={() => {
              onBlurSequence({
                validationKey: [type, 'city'],
              });
            }}
            onChange={e => {
              updateFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
        </FormGroup>
        <FormGroup errorText={validationErrors?.[type]?.postalCode}>
          <label className="usa-label" htmlFor={`${type}.postalCode`}>
            Postal code
          </label>
          <input
            autoCapitalize="none"
            className="usa-input"
            data-testid={`${type}.postalCode`}
            id={`${type}.postalCode`}
            name={`${type}.postalCode`}
            type="text"
            value={data[type].postalCode || ''}
            onBlur={() => {
              onBlurSequence({
                validationKey: [type, 'postalCode'],
              });
            }}
            onChange={e => {
              updateFormValueSequence({
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

InternationalAddress.displayName = 'InternationalAddress';
