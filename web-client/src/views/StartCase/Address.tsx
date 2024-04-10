import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { StateSelect } from './StateSelect';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const Address = connect(
  {
    data: state[props.bind],
    type: props.type,
    updateFormValueAndSecondaryContactInfoSequence: sequences[props.onChange],
    updateFormValueSequence: sequences[props.onChange],
    usStates: state.constants.US_STATES,
    usStatesOther: state.constants.US_STATES_OTHER,
    validateStartCaseSequence: sequences[props.onBlur],
    validationErrors: state.validationErrors,
  },
  function Address({
    data,
    type,
    updateFormValueAndSecondaryContactInfoSequence,
    updateFormValueSequence,
    usStates,
    usStatesOther,
    validateStartCaseSequence,
    validationErrors,
  }) {
    /**
     * @returns {function} MobileCityAndState template
     */
    function MobileCityAndState() {
      return (
        <Mobile>
          <FormGroup errorText={validationErrors?.[type]?.state}>
            <label className="usa-label" htmlFor={`${type}.state`}>
              State
            </label>
            <StateSelect
              useFullStateName
              data={data}
              type={type}
              updateFormValueSequence={updateFormValueSequence}
              usStates={usStates}
              usStatesOther={usStatesOther}
              validateStartCaseSequence={validateStartCaseSequence}
            />
          </FormGroup>
          <FormGroup>
            <label
              aria-hidden
              className="usa-label"
              htmlFor={`${type}.postalCode`}
            >
              Zip code
            </label>
            <input
              aria-label="zip code"
              autoCapitalize="none"
              className="usa-input"
              data-testid={`${type}.postalCode`}
              id={`${type}.postalCode`}
              name={`${type}.postalCode`}
              type="text"
              value={data[type].postalCode || ''}
              onBlur={() => {
                validateStartCaseSequence();
              }}
              onChange={e => {
                updateFormValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
          </FormGroup>
        </Mobile>
      );
    }

    /**
     * @returns {function} NonMobileCityAndState template
     */
    function NonMobileCityAndState() {
      return (
        <NonMobile>
          {/* we do not use <FormGroup> here because of how custom the error text is displayed */}
          <div
            className={classNames(
              'usa-form-group',
              (validationErrors?.[type]?.state ||
                validationErrors?.[type]?.postalCode) &&
                'usa-form-group--error',
            )}
          >
            <div className="grid-row grid-gap">
              <div className="grid-col-5">
                <label className="usa-label" htmlFor={`${type}.state`}>
                  State
                </label>
                <StateSelect
                  useFullStateName
                  className="max-width-180"
                  data={data}
                  type={type}
                  updateFormValueSequence={updateFormValueSequence}
                  usStates={usStates}
                  usStatesOther={usStatesOther}
                  validateStartCaseSequence={validateStartCaseSequence}
                />
              </div>
              <div className="grid-col-7">
                <label
                  aria-hidden
                  className="usa-label"
                  htmlFor={`${type}.postalCode`}
                >
                  Zip code
                </label>
                <input
                  aria-label="zip code"
                  autoCapitalize="none"
                  className="usa-input"
                  data-testid={`${type}.postalCode`}
                  id={`${type}.postalCode`}
                  name={`${type}.postalCode`}
                  type="text"
                  value={data[type].postalCode || ''}
                  onBlur={() => {
                    validateStartCaseSequence();
                  }}
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
            <div className="grid-row grid-gap">
              <div className="grid-col-8">
                {validationErrors?.[type]?.state && (
                  <span className="usa-error-message">
                    {validationErrors[type].state}
                  </span>
                )}
              </div>
              <div className="grid-col-4">
                {validationErrors?.[type]?.postalCode && (
                  <span className="usa-error-message">
                    {validationErrors[type].postalCode}
                  </span>
                )}
              </div>
            </div>
          </div>
        </NonMobile>
      );
    }

    return (
      <div className="address-info">
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
              validateStartCaseSequence();
            }}
            onChange={e => {
              updateFormValueAndSecondaryContactInfoSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
        </FormGroup>
        <div className="usa-form-group">
          <label className="usa-label" htmlFor={`${type}.address2`}>
            Address line 2 <span className="usa-hint">(optional)</span>
          </label>
          <input
            autoCapitalize="none"
            className="usa-input"
            id={`${type}.address2`}
            name={`${type}.address2`}
            type="text"
            value={data[type].address2 || ''}
            onBlur={() => {
              validateStartCaseSequence();
            }}
            onChange={e => {
              updateFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
        </div>
        <div className="usa-form-group">
          <label className="usa-label" htmlFor={`${type}.address3`}>
            Address line 3 <span className="usa-hint">(optional)</span>
          </label>
          <input
            autoCapitalize="none"
            className="usa-input"
            id={`${type}.address3`}
            name={`${type}.address3`}
            type="text"
            value={data[type].address3 || ''}
            onBlur={() => {
              validateStartCaseSequence();
            }}
            onChange={e => {
              updateFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
        </div>
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
              validateStartCaseSequence();
            }}
            onChange={e => {
              updateFormValueAndSecondaryContactInfoSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
        </FormGroup>

        {NonMobileCityAndState()}
        {MobileCityAndState()}
      </div>
    );
  },
);

Address.displayName = 'Address';
