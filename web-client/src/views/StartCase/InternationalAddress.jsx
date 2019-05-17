import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';

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
            'usa-form-group ' +
            (validationErrors &&
            validationErrors[type] &&
            validationErrors[type].address1
              ? 'usa-form-group--error'
              : '')
          }
        >
          <label htmlFor={`${type}.address1`} className="usa-label">
            Mailing Address Line 1
          </label>
          <input
            id={`${type}.address1`}
            type="text"
            name={`${type}.address1`}
            className="usa-input"
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
            className="usa-error-message"
            bind={`validationErrors.${type}.address1`}
          />
        </div>
        <label htmlFor={`${type}.address2`} className="usa-label">
          Address Line 2 <span className="usa-hint">(optional)</span>
        </label>
        <input
          id={`${type}.address2`}
          type="text"
          name={`${type}.address2`}
          className="usa-input"
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
        <label htmlFor={`${type}.address3`} className="usa-label">
          Address Line 3 <span className="usa-hint">(optional)</span>
        </label>
        <input
          id={`${type}.address3`}
          type="text"
          name={`${type}.address3`}
          className="usa-input"
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
        <label htmlFor={`${type}.state`} className="usa-label">
          State/Province/Region <span className="usa-hint">(optional)</span>
        </label>
        <input
          id={`${type}.state`}
          type="text"
          name={`${type}.state`}
          className="usa-input"
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
          className="usa-error-message"
          bind={`validationErrors.${type}.state`}
        />
        <div
          className={
            'usa-form-group ' +
            (validationErrors &&
            validationErrors[type] &&
            validationErrors[type].city
              ? 'usa-form-group--error'
              : '')
          }
        >
          <label htmlFor={`${type}.city`} className="usa-label">
            City
          </label>
          <input
            id={`${type}.city`}
            type="text"
            name={`${type}.city`}
            className="usa-input"
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
            className="usa-error-message"
            bind={`validationErrors.${type}.city`}
          />
        </div>
        <div
          className={
            'usa-form-group ' +
            (validationErrors &&
            validationErrors[type] &&
            validationErrors[type].postalCode
              ? 'usa-form-group--error'
              : '')
          }
        >
          <label
            htmlFor={`${type}.postalCode`}
            aria-label="postal code"
            className="usa-label"
          >
            Postal Code
          </label>
          <input
            id={`${type}.postalCode`}
            type="text"
            name={`${type}.postalCode`}
            className="usa-input"
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
            className="usa-error-message"
            bind={`validationErrors.${type}.postalCode`}
          />
        </div>
      </React.Fragment>
    );
  },
);
