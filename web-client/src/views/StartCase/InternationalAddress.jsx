import { connect } from '@cerebral/react';
import { sequences, state, props } from 'cerebral';
import React from 'react';

export default connect(
  {
    form: state.form,
    type: props.type,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateStartCaseSequence: sequences.validateStartCaseSequence,
    validationErrors: state.validationErrors,
  },
  function Address({
    form,
    type,
    updateFormValueSequence,
    validateStartCaseSequence,
    validationErrors,
  }) {
    return (
      <React.Fragment>
        <div
          className={
            'usa-form-group ' +
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
            value={form[type].address1 || ''}
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
          {validationErrors && validationErrors[type] && (
            <div className="usa-input-error-message beneath">
              {validationErrors[type].address1}
            </div>
          )}
        </div>
        <div className="usa-form-group">
          <label htmlFor={`${type}.address2`}>
            Address Line 2 <span className="usa-form-hint">(optional)</span>
          </label>
          <input
            id={`${type}.address2`}
            type="text"
            name={`${type}.address2`}
            autoCapitalize="none"
            value={form[type].address2 || ''}
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
        <div className="usa-form-group">
          <label htmlFor={`${type}.address3`}>
            Address Line 3 <span className="usa-form-hint">(optional)</span>
          </label>
          <input
            id={`${type}.address3`}
            type="text"
            name={`${type}.address3`}
            autoCapitalize="none"
            value={form[type].address3 || ''}
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
            'usa-form-group ' +
            (validationErrors &&
            validationErrors[type] &&
            validationErrors[type].state
              ? 'usa-input-error'
              : '')
          }
        >
          <label htmlFor={`${type}.state`}>State/Province/Region</label>
          <input
            id={`${type}.state`}
            type="text"
            name={`${type}.state`}
            autoCapitalize="none"
            value={form[type].state || ''}
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
          {validationErrors && validationErrors[type] && (
            <div className="usa-input-error-message beneath">
              {validationErrors[type].state}
            </div>
          )}
        </div>
        <div
          className={
            'usa-form-group ' +
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
            value={form[type].city || ''}
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
          {validationErrors && validationErrors[type] && (
            <div className="usa-input-error-message beneath">
              {validationErrors[type].city}
            </div>
          )}
        </div>
        <div
          className={
            'usa-form-group clear-both ' +
            (validationErrors &&
            validationErrors[type] &&
            validationErrors[type].zip
              ? 'usa-input-error'
              : '')
          }
        >
          <label htmlFor={`${type}.postalCode`} aria-label="postal code">
            ZIP/Postal Code
          </label>
          <input
            id={`${type}.postalCode`}
            type="text"
            name={`${type}.postalCode`}
            autoCapitalize="none"
            value={form[type].postalCode || ''}
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
          {validationErrors && validationErrors[type] && (
            <div className="usa-input-error-message beneath">
              {validationErrors[type].postalCode}
            </div>
          )}
        </div>
      </React.Fragment>
    );
  },
);
