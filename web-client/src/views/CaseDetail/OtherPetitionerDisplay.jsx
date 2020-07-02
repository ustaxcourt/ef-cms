import { connect } from '@cerebral/react';
import { props, state } from 'cerebral';
import React from 'react';

const OtherPetitionerDisplay = connect(
  {
    constants: state.constants,
    petitioner: props.petitioner,
  },
  function OtherPetitionerDisplay({ constants, petitioner }) {
    return (
      <>
        <p className="margin-top-0 address-name">
          {petitioner.name}
          {petitioner.title && <span>, {petitioner.title}</span>}
        </p>
        <p>{petitioner.secondaryName}</p>
        <p>
          <span className="address-line">{petitioner.address1}</span>
          {petitioner.address2 && (
            <span className="address-line">{petitioner.address2}</span>
          )}
          {petitioner.address3 && (
            <span className="address-line">{petitioner.address3}</span>
          )}
          <span className="address-line">
            {petitioner.city && `${petitioner.city}, `}
            {petitioner.state} {petitioner.postalCode}
          </span>
          {petitioner.countryType === constants.COUNTRY_TYPES.INTERNATIONAL && (
            <span className="address-line">{petitioner.country}</span>
          )}
          {petitioner.phone && (
            <span className="address-line margin-top-1">
              {petitioner.phone}
            </span>
          )}
          {petitioner.email && (
            <span className="address-line">{petitioner.email}</span>
          )}
        </p>
      </>
    );
  },
);

export { OtherPetitionerDisplay };
