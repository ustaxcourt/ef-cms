import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { StateSelect } from './StateSelect';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';
export interface AddressType {
  country?: string;
  name?: string;
  secondaryName?: string;
  inCareOf?: string;
  title?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  countryType?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  email?: string;
  paperPetitionEmail?: string;
  phone?: string;
  hasConsentedToEService?: string;
}

export type OnBlurHandler = (params: { validationKey: string[] }) => void;
export type OnChangeHandler = (params: { key: string; value: any }) => void;
export type OnChangeCountryTypeHandler = (params: {
  key: string;
  value: any;
  type: string;
  index?: number;
}) => void;

type AddressUpdatedType = {
  addressInfo: AddressType;
  handleBlur: OnBlurHandler;
  handleChange: OnChangeHandler;
  registerRef?: Function;
  type: string;
};

const addressUpdatedDeps = {
  validationErrors: state.validationErrors,
};

export const AddressUpdated = connect<
  AddressUpdatedType,
  typeof addressUpdatedDeps
>(
  addressUpdatedDeps,
  function Address({
    addressInfo,
    handleBlur,
    handleChange,
    registerRef,
    type,
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
              data={addressInfo}
              handleBlur={() =>
                handleBlur({
                  validationKey: [type, 'state'],
                })
              }
              handleChange={handleChange}
              refProp={registerRef && registerRef(`${type}.state`)}
              type={type}
              onChangeValidationSequence={() =>
                handleBlur({
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
              value={addressInfo.postalCode || ''}
              onBlur={() => {
                handleBlur({
                  validationKey: [type, 'postalCode'],
                });
              }}
              onChange={e => {
                handleChange({
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
                  data={addressInfo}
                  handleBlur={() =>
                    handleBlur({
                      validationKey: [type, 'state'],
                    })
                  }
                  handleChange={handleChange}
                  refProp={registerRef && registerRef(`${type}.state`)}
                  type={type}
                  onChangeValidationSequence={() =>
                    handleBlur({
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
                  value={addressInfo.postalCode || ''}
                  onBlur={() => {
                    handleBlur({
                      validationKey: [type, 'postalCode'],
                    });
                  }}
                  onChange={e => {
                    handleChange({
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
            value={addressInfo.address1 || ''}
            onBlur={() => {
              handleBlur({
                validationKey: [type, 'address1'],
              });
            }}
            onChange={e => {
              handleChange({
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
            value={addressInfo.address2 || ''}
            onBlur={() => {
              handleBlur({
                validationKey: [type, 'address2'],
              });
            }}
            onChange={e => {
              handleChange({
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
            value={addressInfo.address3 || ''}
            onBlur={() => {
              handleBlur({
                validationKey: [type, 'address3'],
              });
            }}
            onChange={e => {
              handleChange({
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
            value={addressInfo.city || ''}
            onBlur={() => {
              handleBlur({
                validationKey: [type, 'city'],
              });
            }}
            onChange={e => {
              handleChange({
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
