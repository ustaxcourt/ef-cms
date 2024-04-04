import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { LegalPlaceOfResidenceSelect } from '@web-client/views/StartCase/LegalPlaceOfResidenceSelect';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const InternationalAddress = connect(
  {
    data: state[props.bind],
    type: props.type,
    updateFormValueSequence: sequences[props.onChange],
    usStates: state.constants.US_STATES,
    usStatesOther: state.constants.US_STATES_OTHER,
    validateStartCaseSequence: sequences[props.onBlur],
    validationErrors: state.validationErrors,
  },
  function InternationalAddress({
    data,
    showPlaceOfLegalResidence,
    type,
    updateFormValueSequence,
    usStates,
    usStatesOther,
    validateStartCaseSequence,
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
            id={`${type}.address1`}
            name={`${type}.address1`}
            type="text"
            value={data[type].address1 || ''}
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
        </div>{' '}
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
        <FormGroup errorText={validationErrors?.[type]?.state}>
          <label className="usa-label" htmlFor={`${type}.state`}>
            State/Province/Region <span className="usa-hint">(optional)</span>
          </label>
          <input
            autoCapitalize="none"
            className="usa-input"
            id={`${type}.state`}
            name={`${type}.state`}
            type="text"
            value={data[type].state || ''}
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
        <FormGroup errorText={validationErrors?.[type]?.city}>
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
        <FormGroup errorText={validationErrors?.[type]?.postalCode}>
          <label className="usa-label" htmlFor={`${type}.postalCode`}>
            Postal code
          </label>
          <input
            autoCapitalize="none"
            className="usa-input"
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
        {showPlaceOfLegalResidence && (
          <FormGroup>
            <label
              aria-hidden
              className="usa-label"
              htmlFor={`${type}.placeOfLegalResidence`}
            >
              Place of legal residence{' '}
              <span className="usa-hint">
                (if different from mailing address)
              </span>
            </label>
            <LegalPlaceOfResidenceSelect
              className="max-width-180"
              data={data}
              type={type}
              updateFormValueSequence={updateFormValueSequence}
              usStates={usStates}
              usStatesOther={usStatesOther}
              validateStartCaseSequence={validateStartCaseSequence}
            />
          </FormGroup>
        )}
      </>
    );
  },
);

InternationalAddress.displayName = 'InternationalAddress';
