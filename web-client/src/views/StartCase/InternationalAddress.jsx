import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';
import { Text } from '../../ustc-ui/Text/Text';

export const InternationalAddress = connect(
  {
    data: state[props.bind],
    type: props.type,
    updateFormValueSequence: sequences[props.onChange],
    validateStartCaseSequence: sequences[props.onBlur],
    validationErrors: state.validationErrors,
  },
  ({
    data,
    type,
    updateFormValueSequence,
    validateStartCaseSequence,
    validationErrors,
  }) => {
    return (
      <React.Fragment>
        <div
          className={
            'ustc-form-group ' +
            (validationErrors &&
            validationErrors[type] &&
            validationErrors[type].address1
              ? 'usa-input-error'
              : '')
          }
        >
          <label htmlFor={`${type}.address1`}>Mailing Address</label>
          <input
            id={`${type}.address1`}
            type="text"
            name={`${type}.address1`}
            autoCapitalize="none"
            value={data[type].address1 || ''}
            onChange={e => {
              updateFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
            onBlur={() => {
              validateStartCaseSequence();
            }}
          />
          <Text
            className="usa-input-error-message"
            bind={`validationErrors.${type}.address1`}
          />
        </div>
        <div className="ustc-form-group">
          <label htmlFor={`${type}.address2`}>
            Address Line 2 <span className="usa-form-hint">(optional)</span>
          </label>
          <input
            id={`${type}.address2`}
            type="text"
            name={`${type}.address2`}
            autoCapitalize="none"
            value={data[type].address2 || ''}
            onChange={e => {
              updateFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
            onBlur={() => {
              validateStartCaseSequence();
            }}
          />
        </div>
        <div className="ustc-form-group">
          <label htmlFor={`${type}.address3`}>
            Address Line 3 <span className="usa-form-hint">(optional)</span>
          </label>
          <input
            id={`${type}.address3`}
            type="text"
            name={`${type}.address3`}
            autoCapitalize="none"
            value={data[type].address3 || ''}
            onChange={e => {
              updateFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
            onBlur={() => {
              validateStartCaseSequence();
            }}
          />
        </div>
        <div
          className={
            'ustc-form-group ' +
            (validationErrors &&
            validationErrors[type] &&
            validationErrors[type].state
              ? 'usa-input-error'
              : '')
          }
        >
          <label htmlFor={`${type}.state`}>
            State/Province/Region{' '}
            <span className="usa-form-hint">(optional)</span>
          </label>
          <input
            id={`${type}.state`}
            type="text"
            name={`${type}.state`}
            autoCapitalize="none"
            value={data[type].state || ''}
            onChange={e => {
              updateFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
            onBlur={() => {
              validateStartCaseSequence();
            }}
          />
          <Text
            className="usa-input-error-message"
            bind={`validationErrors.${type}.state`}
          />
        </div>
        <div
          className={
            'ustc-form-group ' +
            (validationErrors &&
            validationErrors[type] &&
            validationErrors[type].city
              ? 'usa-input-error'
              : '')
          }
        >
          <label htmlFor={`${type}.city`}>City</label>
          <input
            id={`${type}.city`}
            type="text"
            name={`${type}.city`}
            autoCapitalize="none"
            value={data[type].city || ''}
            onChange={e => {
              updateFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
            onBlur={() => {
              validateStartCaseSequence();
            }}
          />
          <Text
            className="usa-input-error-message"
            bind={`validationErrors.${type}.city`}
          />
        </div>
        <div
          className={
            'ustc-form-group ' +
            (validationErrors &&
            validationErrors[type] &&
            validationErrors[type].postalCode
              ? 'usa-input-error'
              : '')
          }
        >
          <label htmlFor={`${type}.postalCode`} aria-label="postal code">
            Postal Code
          </label>
          <input
            id={`${type}.postalCode`}
            type="text"
            name={`${type}.postalCode`}
            autoCapitalize="none"
            value={data[type].postalCode || ''}
            onChange={e => {
              updateFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
            onBlur={() => {
              validateStartCaseSequence();
            }}
          />
          <Text
            className="usa-input-error-message"
            bind={`validationErrors.${type}.postalCode`}
          />
        </div>
      </React.Fragment>
    );
  },
);
