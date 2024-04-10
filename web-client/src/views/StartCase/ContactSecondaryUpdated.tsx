import { Address } from './Address';
import { Country } from './Country';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { InternationalAddress } from './InternationalAddress';
import { PlaceOfLegalResidenceDropdown } from '@web-client/views/StartCase/PlaceOfLegalResidenceDropdown';
import { props as cerebralProps } from 'cerebral';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

const props = cerebralProps as unknown as {
  bind: string;
  onBlur: string;
  onChange: string;
  nameLabel: string;
  displayInCareOf?: boolean;
  showSameAsPrimaryCheckbox?: boolean;
  showPlaceOfLegalResidence?: boolean;
};

export const ContactSecondaryUpdated = connect(
  {
    bind: props.bind,
    constants: state.constants,
    data: state[props.bind],
    displayInCareOf: props.displayInCareOf,
    nameLabel: props.nameLabel,
    //   onBlur: props.onBlur,
    //   onBlurSequence: sequences[props.onBlur],
    onChange: props.onChange,

    onChangeSequence: sequences[props.onChange],
    showPlaceOfLegalResidence: props.showPlaceOfLegalResidence,
    showSameAsPrimaryCheckbox: props.showSameAsPrimaryCheckbox,
    updateFormValueAndSecondaryContactInfoSequence:
      sequences.updateFormValueAndSecondaryContactInfoSequence,
    //   validationErrors: state.validationErrors,
  },
  function ContactSecondaryUpdated({
    bind,
    constants,
    data,
    displayInCareOf,
    nameLabel,
    // onBlurSequence,
    onChange,
    onChangeSequence,
    showPlaceOfLegalResidence,
    showSameAsPrimaryCheckbox,
    updateFormValueAndSecondaryContactInfoSequence,
    // validationErrors = {} as {
    //   contactSecondary?: {
    //     secondaryName: string;
    //     inCareOf: string;
    //     name: string;
    //     phone: string;
    //   };
    // },
  }) {
    return (
      <>
        <div>
          <FormGroup
          // errorText={
          //   validationErrors.contactSecondary &&
          //   validationErrors.contactSecondary.name
          // }
          >
            <label className="usa-label" htmlFor="name">
              {nameLabel}
            </label>
            <input
              autoCapitalize="none"
              className="usa-input"
              data-testid="contact-primary-name"
              id="name"
              name="contactSecondary.name"
              type="text"
              value={data.contactSecondary.name || ''}
              onBlur={() => {
                // onBlurSequence();
              }}
              onChange={e => {
                onChangeSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
          </FormGroup>
          {displayInCareOf && (
            <InCareOf
              inCareOf={data.contactSecondary.inCareOf}
              onChangeSequence={onChangeSequence}
            />
          )}
          {showSameAsPrimaryCheckbox && (
            <SameAddressCheckbox
              updateFormValueAndSecondaryContactInfoSequence={
                updateFormValueAndSecondaryContactInfoSequence
              }
              useSameAsPrimary={data.useSameAsPrimary}
            />
          )}
          {!data.useSameAsPrimary && (
            <>
              <Country
                bind={bind}
                type="contactSecondary"
                // onBlur={onBlur}
                onChange={onChangeSequence}
              />
              {data.contactSecondary.countryType ===
                constants.COUNTRY_TYPES.DOMESTIC && (
                <Address
                  bind={bind}
                  type="contactSecondary"
                  // onBlur={onBlur}
                  onChange={onChange}
                />
              )}
              {data.contactSecondary.countryType ===
                constants.COUNTRY_TYPES.INTERNATIONAL && (
                <InternationalAddress
                  bind={bind}
                  type="contactSecondary"
                  // onBlur={onBlur}
                  onChange={onChange}
                />
              )}
              {showPlaceOfLegalResidence && (
                <PlaceOfLegalResidenceDropdown
                  bind={bind}
                  type="contactSecondary"
                  onChange={onChange}
                />
              )}
            </>
          )}

          {/* {contactsHelper.showPaperPetitionEmailFieldAndConsentBox && (
            <>
              <PaperPetitionEmail bind={bind} contactType="contactSecondary" />
              <EConsent bind={bind} contactType="contactSecondary" />
            </>
          )} */}
          <FormGroup
            className="phone-input"
            // errorText={
            //   validationErrors.contactSecondary &&
            //   validationErrors.contactSecondary.phone
            // }
          >
            <label className="usa-label" htmlFor="phone">
              Phone number
            </label>
            <span className="usa-hint">
              If you do not have a current phone number, enter N/A.
            </span>
            <input
              autoCapitalize="none"
              className="usa-input max-width-200"
              data-testid="phone"
              id="phone"
              name="contactSecondary.phone"
              type="tel"
              value={data.contactSecondary.phone || ''}
              // onBlur={() => {
              //   onBlurSequence();
              // }}
              onChange={e => {
                onChangeSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
          </FormGroup>
        </div>
      </>
    );
  },
);

function SameAddressCheckbox({
  updateFormValueAndSecondaryContactInfoSequence,
  useSameAsPrimary,
}) {
  return (
    <FormGroup>
      <input
        checked={useSameAsPrimary}
        className="usa-checkbox__input"
        id="use-same-address-above"
        name="useSameAsPrimary"
        type="checkbox"
        onChange={e => {
          console.log('checking...', e.target.checked);
          updateFormValueAndSecondaryContactInfoSequence({
            key: e.target.name,
            value: e.target.checked,
          });
          // toggleUseContactPrimaryAddressSequence(); // not sure if we need
        }}
      />
      <label
        className="usa-checkbox__label"
        data-testid="use-same-address-above-label"
        htmlFor="use-same-address-above"
        id="use-same-address-above-label"
      >
        Use same address &amp; phone number as above
      </label>
    </FormGroup>
  );
}

function InCareOf({ inCareOf, onChangeSequence }) {
  return (
    <FormGroup
    // errorText={
    //   validationErrors.contactSecondary &&
    //   validationErrors.contactSecondary.inCareOf
    // }
    >
      <label className="usa-label" htmlFor="inCareOf">
        <span>In care of</span>
      </label>
      <input
        autoCapitalize="none"
        className="usa-input"
        id="inCareOf"
        name="contactSecondary.inCareOf"
        type="text"
        value={inCareOf || ''}
        onBlur={() => {
          // onBlurSequence();
        }}
        onChange={e => {
          onChangeSequence({
            key: e.target.name,
            value: e.target.value,
          });
        }}
      />
    </FormGroup>
  );
}

// const displayTitle = () => (
//   <div className="usa-form-group">
//     <label className="usa-label with-hint" htmlFor="title">
//       Title{' '}
//       {contactsHelper.contactSecondary.titleHint && (
//         <span className="usa-hint">
//           ({contactsHelper.contactSecondary.titleHint})
//         </span>
//       )}
//     </label>
//     <span className="usa-hint">For example, executor, PR, etc.</span>
//     <input
//       autoCapitalize="none"
//       className="usa-input"
//       id="title"
//       name="contactSecondary.title"
//       type="text"
//       value={data.contactSecondary.title || ''}
//       onChange={e => {
//         onChangeSequence({
//           key: e.target.name,
//           value: e.target.value,
//         });
//       }}
//     />
//   </div>
// );
ContactSecondaryUpdated.displayName = 'ContactSecondaryUpdated';
