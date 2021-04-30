const React = require('react');

export const AddressLabel = ({
  additionalName,
  address1,
  address2,
  address3,
  city,
  countryName,
  inCareOf,
  name,
  postalCode,
  secondaryName,
  state,
  title,
}) => {
  return (
    <div className="address-label">
      <style type="text/css">
        {'@media print{@page {margin-bottom: 2cm}}'}
      </style>
      <div>{name}</div>
      {additionalName && <div>c/o {additionalName}</div>}
      {secondaryName && (
        <div>
          c/o {secondaryName}
          {title && <span>, {title}</span>}
        </div>
      )}
      {inCareOf && (
        <div>
          c/o {inCareOf}
          {title && <span>, {title}</span>}
        </div>
      )}
      <div>{address1}</div>
      {address2 && <div>{address2}</div>}
      {address3 && <div>{address3}</div>}
      <div>
        {city}, {state} {postalCode}
      </div>
      <div>{countryName}</div>
    </div>
  );
};
