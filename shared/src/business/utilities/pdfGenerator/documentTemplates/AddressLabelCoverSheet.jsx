const React = require('react');
const { AddressLabel } = require('../components/AddressLabel.jsx');

export const AddressLabelCoverSheet = ({
  additionalName,
  address1,
  address2,
  address3,
  city,
  countryName,
  docketNumberWithSuffix,
  inCareOf,
  name,
  postalCode,
  secondaryName,
  state,
  title,
}) => {
  return (
    <div id="address-label-cover-sheet">
      <div className="docket">Docket {docketNumberWithSuffix}</div>
      <AddressLabel
        additionalName={additionalName}
        address1={address1}
        address2={address2}
        address3={address3}
        city={city}
        countryName={countryName}
        inCareOf={inCareOf}
        name={name}
        postalCode={postalCode}
        secondaryName={secondaryName}
        state={state}
        title={title}
      />
    </div>
  );
};
