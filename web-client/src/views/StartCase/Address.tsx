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
    onBlur: props.onBlur,
    registerRef: props.registerRef,
    type: props.type,
    updateFormValueAndSecondaryContactInfoSequence: sequences[props.onChange],
    updateFormValueSequence: sequences[props.onChange],
    validationErrors: state.validationErrors,
  },
  function Address({
    data,
    onBlur,
    registerRef,
    type,
    updateFormValueAndSecondaryContactInfoSequence,
    updateFormValueSequence,
    validationErrors,
  }) {
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
              handleBlur={() =>
                onBlur({
                  validationKey: [type, 'state'],
                })
              }
              handleChange={updateFormValueSequence}
              refProp={registerRef && registerRef(`${type}.state`)}
              type={type}
              onChangeValidationSequence={() =>
                onBlur({
                  validationKey: [type, 'state'],
                })
              }
            />
          </FormGroup>
          <FormGroup errorText={validationErrors?.[type]?.postalCode}>
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
                onBlur({
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
        </Mobile>
      );
    }

    function NonMobileCityAndState() {
      return (
        <NonMobile>
          {/* we do not use <FormGroup> here because of how custom the error text is displayed */}
          <div
            className={classNames(
              'usa-form-group',
              'usa-form-group-horizontal',
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
                  handleBlur={() =>
                    onBlur({
                      validationKey: [type, 'state'],
                    })
                  }
                  handleChange={updateFormValueSequence}
                  refProp={registerRef && registerRef(`${type}.state`)}
                  type={type}
                  onChangeValidationSequence={() =>
                    onBlur({
                      validationKey: [type, 'state'],
                    })
                  }
                />
                <div>
                  {validationErrors?.[type]?.state && (
                    <span
                      className="usa-error-message"
                      data-testid="state-error-message"
                    >
                      {validationErrors[type].state}
                    </span>
                  )}
                </div>
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
                  ref={registerRef && registerRef(`${type}.postalCode`)}
                  type="text"
                  value={data[type].postalCode || ''}
                  onBlur={() => {
                    onBlur({
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
                <div>
                  {validationErrors?.[type]?.postalCode && (
                    <span
                      className="usa-error-message"
                      data-testid="postal-code-error-message"
                    >
                      {validationErrors[type].postalCode}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </NonMobile>
      );
    }
    return (
      <>
        <FormGroup
          errorMessageId="address-1-error-message"
          errorText={validationErrors?.[type]?.address1}
        >
          <label className="usa-label" htmlFor={`${type}.address1`}>
            Mailing address line 1
          </label>
          <input
            autoCapitalize="none"
            className="usa-input"
            data-testid={`${type}.address1`}
            id={`${type}.address1`}
            name={`${type}.address1`}
            ref={registerRef && registerRef(`${type}.address1`)}
            type="text"
            value={data[type].address1 || ''}
            onBlur={() => {
              onBlur({
                validationKey: [type, 'address1'],
              });
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
            Mailing address line 2 <span className="usa-hint">(optional)</span>
          </label>
          <input
            autoCapitalize="none"
            className="usa-input"
            id={`${type}.address2`}
            name={`${type}.address2`}
            type="text"
            value={data[type].address2 || ''}
            onBlur={() => {
              onBlur({
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
        </div>
        <div className="usa-form-group">
          <label className="usa-label" htmlFor={`${type}.address3`}>
            Mailing address line 3 <span className="usa-hint">(optional)</span>
          </label>
          <input
            autoCapitalize="none"
            className="usa-input"
            id={`${type}.address3`}
            name={`${type}.address3`}
            type="text"
            value={data[type].address3 || ''}
            onBlur={() => {
              onBlur({
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
        <FormGroup
          errorMessageId="city-error-message"
          errorText={validationErrors?.[type]?.city}
        >
          <label className="usa-label" htmlFor={`${type}.city`}>
            City
          </label>
          <input
            autoCapitalize="none"
            className="usa-input"
            data-testid={`${type}.city`}
            id={`${type}.city`}
            name={`${type}.city`}
            ref={registerRef && registerRef(`${type}.city`)}
            type="text"
            value={data[type].city || ''}
            onBlur={() => {
              onBlur({
                validationKey: [type, 'city'],
              });
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
      </>
    );
  },
);
