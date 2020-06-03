const React = require('react');

export const AddressLabelCoverSheet = ({
  address1,
  address2,
  address3,
  city,
  countryName,
  docketNumberWithSuffix,
  name,
  postalCode,
  state,
}) => {
  return (
    <div id="address-label-cover-sheet">
      <div className="docket">Docket {docketNumberWithSuffix}</div>
      <div className="address">
        <div>{name}</div>
        <div>{address1}</div>
        {address2 && <div>{address2}</div>}
        {address3 && <div>{address3}</div>}
        <div>
          {city}, {state} {postalCode}
        </div>
        {!address3 && <div>{countryName}</div>}
      </div>
    </div>
  );
};
