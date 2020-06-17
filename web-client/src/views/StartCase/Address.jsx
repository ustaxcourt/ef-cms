import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { StateSelect } from './StateSelect';
import { ValidationText } from '../../ustc-ui/Text/ValidationText';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
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
    return (
      <>
        <FormGroup
          errorText={
            validationErrors &&
            validationErrors[type] &&
            validationErrors[type].address1
          }
        >
          <label className="usa-label" htmlFor={`${type}.address1`}>
            Mailing address line 1
          </label>
          <input
            autoCapitalize="none"
            className="usa-input"
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
        <NonMobile>
          {/* we do not use <FormGroup> here because of how custom the error text is displayed */}
          <div
            className={classNames(
              'usa-form-group',
              validationErrors &&
                validationErrors[type] &&
                (validationErrors[type].city || validationErrors[type].state) &&
                'usa-form-group--error',
            )}
          >
            <div className="grid-row grid-gap state-and-city">
              <div className="grid-col-8">
                <label className="usa-label" htmlFor={`${type}.city`}>
                  City
                </label>
                <input
                  autoCapitalize="none"
                  className="usa-input usa-input--inline"
                  id={`${type}.city`}
                  name={`${type}.city`}
                  type="text"
                  value={data[type].city || ''}
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
              <div className="grid-col-4">
                <label className="usa-label" htmlFor={`${type}.state`}>
                  State
                </label>
                <StateSelect
                  data={data}
                  type={type}
                  updateFormValueSequence={updateFormValueSequence}
                  usStates={usStates}
                  usStatesOther={usStatesOther}
                  validateStartCaseSequence={validateStartCaseSequence}
                />
              </div>
            </div>
            <div className="grid-row grid-gap">
              <div className="grid-col-8">
                <ValidationText field={`${type}.city`} />
              </div>
              <div className="grid-col-4">
                <ValidationText field={`${type}.state`} />
              </div>
            </div>
          </div>
        </NonMobile>
        <Mobile>
          <FormGroup
            errorText={
              validationErrors &&
              validationErrors[type] &&
              validationErrors[type].city
            }
          >
            <label className="usa-label" htmlFor={`${type}.city`}>
              City
            </label>
            <input
              autoCapitalize="none"
              className="usa-input"
              id={`${type}.city`}
              name={`${type}.city`}
              type="text"
              value={data[type].city || ''}
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

          <FormGroup
            errorText={
              validationErrors &&
              validationErrors[type] &&
              validationErrors[type].state
            }
          >
            <label className="usa-label" htmlFor={`${type}.state`}>
              State
            </label>
            <StateSelect
              data={data}
              type={type}
              updateFormValueSequence={updateFormValueSequence}
              usStates={usStates}
              usStatesOther={usStatesOther}
              validateStartCaseSequence={validateStartCaseSequence}
            />
          </FormGroup>
        </Mobile>

        <FormGroup
          errorText={
            validationErrors &&
            validationErrors[type] &&
            validationErrors[type].postalCode
          }
        >
          <label
            aria-hidden
            className="usa-label"
            htmlFor={`${type}.postalCode`}
          >
            ZIP code
          </label>
          <input
            aria-label="zip code"
            autoCapitalize="none"
            className="usa-input max-width-200 tablet:usa-input--medium"
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
      </>
    );
  },
);
