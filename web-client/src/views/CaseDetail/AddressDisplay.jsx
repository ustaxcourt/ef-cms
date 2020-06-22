import React from 'react';

export const AddressDisplay = (contact, constants, { nameOverride } = {}) => {
  return (
    <>
      <p className="margin-top-0 address-name">
        {nameOverride || contact.name}{' '}
        {contact.barNumber && `(${contact.barNumber})`}
        {contact.inCareOf && (
          <span>
            <br />
            c/o {contact.inCareOf}
          </span>
        )}
      </p>
      <p>
        <span className="address-line">{contact.address1}</span>
        {contact.address2 && (
          <span className="address-line">{contact.address2}</span>
        )}
        {contact.address3 && (
          <span className="address-line">{contact.address3}</span>
        )}
        <span className="address-line">
          {contact.city && `${contact.city}, `}
          {contact.state} {contact.postalCode}
        </span>
        {contact.countryType === constants.COUNTRY_TYPES.INTERNATIONAL && (
          <span className="address-line">{contact.country}</span>
        )}
        {contact.phone && (
          <span className="address-line margin-top-1">{contact.phone}</span>
        )}
      </p>
    </>
  );
};
