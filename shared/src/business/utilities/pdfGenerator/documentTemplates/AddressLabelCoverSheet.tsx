import { AddressLabel } from '@shared/business/utilities/pdfGenerator/components/AddressLabel';
import React from 'react';

type AddressLabelCoverSheetParams = {
  additionalName: string;
  address1: string;
  address2: string;
  address3: string;
  city: string;
  country: string;
  countryType: string;
  docketNumberWithSuffix: string;
  inCareOf: string;
  name: string;
  postalCode: string;
  secondaryName: string;
  state: string;
  title: string;
};

export const AddressLabelCoverSheet = ({
  additionalName,
  address1,
  address2,
  address3,
  city,
  country,
  countryType,
  docketNumberWithSuffix,
  inCareOf,
  name,
  postalCode,
  secondaryName,
  state,
  title,
}: AddressLabelCoverSheetParams) => {
  return (
    <div id="address-label-cover-sheet">
      <div className="docket">Docket {docketNumberWithSuffix}</div>
      <AddressLabel
        additionalName={additionalName}
        address1={address1}
        address2={address2}
        address3={address3}
        city={city}
        country={country}
        countryType={countryType}
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
