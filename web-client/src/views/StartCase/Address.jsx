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
            (validationErrors[type] && validationErrors[type].address1
              ? 'usa-input-error'
              : '')
          }
        >
          <label htmlFor={`${type}.address1`}>Street Address</label>
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
          {validationErrors[type] && (
            <div className="usa-input-error-message beneath">
              {validationErrors[type].address1}
            </div>
          )}
        </div>
        <div className="usa-form-group">
          <label htmlFor={`${type}.address2`}>
            Suite/Apt # <span className="usa-form-hint">(optional)</span>
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
        <div
          className={
            validationErrors[type] &&
            (validationErrors[type].city || validationErrors[type].state)
              ? 'usa-input-error'
              : ''
          }
        >
          <div className="usa-form-group ustc-form-group-city">
            <label htmlFor={`${type}.city`}>City</label>
            <input
              id={`${type}.city`}
              type="text"
              name={`${type}.city`}
              className={
                'usa-input-inline ' +
                (validationErrors[type] && validationErrors[type].city
                  ? 'ustc-input-error'
                  : '')
              }
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
          </div>
          <div className="usa-form-group ustc-form-group-state">
            <label htmlFor={`${type}.state`}>State</label>
            <select
              className={
                'usa-input-inline ' +
                (validationErrors[type] && validationErrors[type].state
                  ? 'ustc-input-error'
                  : '')
              }
              id={`${type}.state`}
              name={`${type}.state`}
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
            >
              <option value="">- Select -</option>
              <option value="AL">Alabama</option>
              <option value="AK">Alaska</option>
              <option value="AZ">Arizona</option>
              <option value="AR">Arkansas</option>
              <option value="CA">California</option>
              <option value="CO">Colorado</option>
              <option value="CT">Connecticut</option>
              <option value="DE">Delaware</option>
              <option value="DC">District of Columbia</option>
              <option value="FL">Florida</option>
              <option value="GA">Georgia</option>
              <option value="HI">Hawaii</option>
              <option value="ID">Idaho</option>
              <option value="IL">Illinois</option>
              <option value="IN">Indiana</option>
              <option value="IA">Iowa</option>
              <option value="KS">Kansas</option>
              <option value="KY">Kentucky</option>
              <option value="LA">Louisiana</option>
              <option value="ME">Maine</option>
              <option value="MD">Maryland</option>
              <option value="MA">Massachusetts</option>
              <option value="MI">Michigan</option>
              <option value="MN">Minnesota</option>
              <option value="MS">Mississippi</option>
              <option value="MO">Missouri</option>
              <option value="MT">Montana</option>
              <option value="NE">Nebraska</option>
              <option value="NV">Nevada</option>
              <option value="NH">New Hampshire</option>
              <option value="NJ">New Jersey</option>
              <option value="NM">New Mexico</option>
              <option value="NY">New York</option>
              <option value="NC">North Carolina</option>
              <option value="ND">North Dakota</option>
              <option value="OH">Ohio</option>
              <option value="OK">Oklahoma</option>
              <option value="OR">Oregon</option>
              <option value="PA">Pennsylvania</option>
              <option value="RI">Rhode Island</option>
              <option value="SC">South Carolina</option>
              <option value="SD">South Dakota</option>
              <option value="TN">Tennessee</option>
              <option value="TX">Texas</option>
              <option value="UT">Utah</option>
              <option value="VT">Vermont</option>
              <option value="VA">Virginia</option>
              <option value="WA">Washington</option>
              <option value="WV">West Virginia</option>
              <option value="WI">Wisconsin</option>
              <option value="WY">Wyoming</option>
            </select>
          </div>
          {validationErrors[type] &&
            (validationErrors[type].city || validationErrors[type].state) && (
              <>
                <div className="usa-input-error-message beneath">
                  {validationErrors[type].city}
                </div>
                <div className="usa-input-error-message beneath">
                  {validationErrors[type].state}
                </div>
              </>
            )}
        </div>
        <div
          className={
            'usa-form-group clear-both ' +
            (validationErrors[type] && validationErrors[type].zip
              ? 'usa-input-error'
              : '')
          }
        >
          <label htmlFor={`${type}.zip`}>ZIP Code</label>
          <input
            id={`${type}.zip`}
            type="text"
            name={`${type}.zip`}
            className="usa-input-medium"
            autoCapitalize="none"
            value={form[type].zip || ''}
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
          {validationErrors[type] && validationErrors[type] && (
            <div className="usa-input-error-message beneath">
              {validationErrors.contactPrimary.zip}
            </div>
          )}
        </div>
      </React.Fragment>
    );
  },
);
