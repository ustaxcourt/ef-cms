import React from 'react';

export const PractitionerLabel = ({
  address1,
  address2,
  address3,
  barNumber,
  city,
  country,
  countryType,
  email,
  name,
  phone,
  postalCode,
  state,
}: {
  address1: string;
  address2?: string;
  address3?: string;
  barNumber: string;
  city: string;
  country: string;
  countryType: string;
  email: string;
  name: string;
  phone: string;
  postalCode: string;
  state: string;
}) => {
  return (
    <div className="address-label">
      <style type="text/css">
        {'@media print{@page {margin-bottom: 2cm}}'}
      </style>
      <div>{name}</div>
      <div>{address1}</div>
      {address2 && <div>{address2}</div>}
      {address3 && <div>{address3}</div>}
      <div>
        {city}, {state} {postalCode}
      </div>
      <div>{countryType === 'international' && country}</div>
      <div>{phone}</div>
      <div>Tax Court Bar No. {barNumber}</div>
      <div>{email}</div>
    </div>
  );
};
