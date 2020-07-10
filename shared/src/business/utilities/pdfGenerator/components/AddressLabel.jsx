const React = require('react');

export const AddressLabel = ({
  address1,
  address2,
  address3,
  city,
  countryName,
  name,
  postalCode,
  state,
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
      {!address3 && <div>{countryName}</div>}
    </div>
  );
};
