import React from 'react';

export const OtherPetitionerDisplay = (petitioner, constants) => {
  return (
    <>
      <p className="margin-top-0 address-name">
        {petitioner.additionalName || petitioner.name}
        {petitioner.inCareOf && (
          <span>
            <br />
            c/o {petitioner.inCareOf}
          </span>
        )}
      </p>
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
          <span className="address-line margin-top-1">{petitioner.phone}</span>
        )}
      </p>
    </>
  );
};
