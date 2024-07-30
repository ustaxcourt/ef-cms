import {
  AddressType,
  OnBlurHandler,
  OnChangeHandler,
} from '@web-client/views/StartCase/AddressUpdated';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { PlaceOfLegalResidenceSelect } from '@web-client/views/StartCase/PlaceOfLegalResidenceSelect';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

type PlaceOfLegalResidenceProps = {
  addressInfo: AddressType;
  handleBlur: OnBlurHandler;
  handleChange: OnChangeHandler;
  placeOfLegalResidenceTitle?: string;
  registerRef?: Function;
  type: string;
};

const placeOfLegalResidenceDeps = {
  validationErrors: state.validationErrors,
};

export const PlaceOfLegalResidenceDropdown = connect<
  PlaceOfLegalResidenceProps,
  typeof placeOfLegalResidenceDeps
>(
  placeOfLegalResidenceDeps,
  function PlaceOfLegalResidenceDropdown({
    addressInfo,
    handleBlur,
    handleChange,
    placeOfLegalResidenceTitle,
    registerRef,
    type,
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
              className="usa-label"
              htmlFor={`${type}-placeOfLegalResidence`}
            >
              {placeOfLegalResidenceTitle || 'Place of legal residence'}{' '}
              <span className="usa-hint">
                (if different from mailing address)
              </span>
            </label>
            <PlaceOfLegalResidenceSelect
              data={addressInfo}
              handleBlur={handleBlur}
              handleChange={handleChange}
              refProp={
                registerRef && registerRef(`${type}-placeOfLegalResidence`)
              }
              type={type}
            />
          </FormGroup>
        </Mobile>
        <NonMobile>
          <FormGroup
            errorMessageId="place-of-legal-residence-error-message"
            errorText={validationErrors?.[type]?.placeOfLegalResidence}
          >
            <label
              className="usa-label"
              htmlFor={`${type}-placeOfLegalResidence`}
            >
              {placeOfLegalResidenceTitle || 'Place of legal residence'}{' '}
              <span className="usa-hint">
                (if different from mailing address)
              </span>
            </label>
            <PlaceOfLegalResidenceSelect
              className="max-width-180"
              data={addressInfo}
              handleBlur={handleBlur}
              handleChange={handleChange}
              refProp={
                registerRef && registerRef(`${type}-placeOfLegalResidence`)
              }
              type={type}
            />
          </FormGroup>
        </NonMobile>
      </div>
    );
  },
);

PlaceOfLegalResidenceDropdown.displayName = 'PlaceOfLegalResidenceDropdown';
