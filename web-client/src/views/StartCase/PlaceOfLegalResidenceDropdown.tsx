import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { PlaceOfLegalResidenceSelect } from '@web-client/views/StartCase/PlaceOfLegalResidenceSelect';
import { props as cerebralProps } from 'cerebral';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

const props = cerebralProps as unknown as {
  type: string;
  bind: string;
  onChange: string;
  registerRef: Function;
  placeOfLegalResidenceTitle?: string;
  onBlurSequence: Function;
};

export const PlaceOfLegalResidenceDropdown = connect(
  {
    data: state[props.bind],
    onBlurSequence: props.onBlurSequence,
    placeOfLegalResidenceTitle: props.placeOfLegalResidenceTitle,
    registerRef: props.registerRef,
    type: props.type,
    updateFormValueSequence: sequences[props.onChange],
    usStates: state.constants.US_STATES,
    usStatesOther: state.constants.US_STATES_OTHER,
    validationErrors: state.validationErrors,
  },
  function PlaceOfLegalResidenceDropdown({
    data,
    onBlurSequence,
    placeOfLegalResidenceTitle,
    registerRef,
    type,
    updateFormValueSequence,
    usStates,
    usStatesOther,
    validationErrors,
  }) {
    return (
      <div className="address-info">
        <Mobile>
          <FormGroup
            errorMessageId="place-of-legal-residence-error-message"
            errorText={validationErrors?.[type]?.placeOfLegalResidence}
          >
            <label
              aria-hidden
              className="usa-label"
              htmlFor={`${type}.placeOfLegalResidence`}
            >
              {placeOfLegalResidenceTitle || 'Place of legal residence'}{' '}
              <span className="usa-hint">
                (if different from mailing address)
              </span>
            </label>
            <PlaceOfLegalResidenceSelect
              data={data}
              refProp={
                registerRef && registerRef(`${type}.placeOfLegalResidence`)
              }
              type={type}
              updateFormValueSequence={updateFormValueSequence}
              usStates={usStates}
              usStatesOther={usStatesOther}
            />
          </FormGroup>
        </Mobile>
        <NonMobile>
          <FormGroup
            errorMessageId="place-of-legal-residence-error-message"
            errorText={validationErrors?.[type]?.placeOfLegalResidence}
          >
            <label
              aria-hidden
              className="usa-label"
              htmlFor={`${type}.placeOfLegalResidence`}
            >
              {placeOfLegalResidenceTitle || 'Place of legal residence'}{' '}
              <span className="usa-hint">
                (if different from mailing address)
              </span>
            </label>
            <PlaceOfLegalResidenceSelect
              className="max-width-180"
              data={data}
              refProp={
                registerRef && registerRef(`${type}.placeOfLegalResidence`)
              }
              type={type}
              updateFormValueSequence={updateFormValueSequence}
              usStates={usStates}
              usStatesOther={usStatesOther}
              onBlur={onBlurSequence}
            />
          </FormGroup>
        </NonMobile>
      </div>
    );
  },
);

PlaceOfLegalResidenceDropdown.displayName = 'PlaceOfLegalResidenceDropdown';
