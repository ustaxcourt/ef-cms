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
  placeOfLegalResidenceTitle?: string;
  onBlurSequence: Function;
};

export const PlaceOfLegalResidenceDropdown = connect(
  {
    data: state[props.bind],
    onBlurSequence: props.onBlurSequence,
    placeOfLegalResidenceTitle: props.placeOfLegalResidenceTitle,
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
            errorText={validationErrors?.[type]?.placeOfLegalResidence}
          >
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
            <PlaceOfLegalResidenceSelect
              data={data}
              type={type}
              updateFormValueSequence={updateFormValueSequence}
              usStates={usStates}
              usStatesOther={usStatesOther}
            />
          </FormGroup>
        </Mobile>
        <NonMobile>
          <FormGroup
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
