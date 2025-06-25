import { COUNTRY_TYPES } from '@shared/business/entities/EntityConstants';
import { DocketHeader } from '@shared/business/utilities/pdfGenerator/components/DocketHeader';
import { PrimaryHeader } from '@shared/business/utilities/pdfGenerator/components/PrimaryHeader';
import React from 'react';

type RenderTableParams = {
  data: ChangeOfAddressContactInfo;
  label: string;
  options: ChangeOfAddressOptions;
};
const renderTable = ({ data, label, options }: RenderTableParams) => {
  return (
    <table id={`contact_info_${label}`}>
      <thead>
        <tr>
          <th>{label} Contact Information</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          {options.isEmailChange && (
            <td>{data.email || 'No email provided'}</td>
          )}
          {options.isPhoneChangeOnly && <td>{data.phone}</td>}
          {options.isAddressChange && (
            <td>
              {data.inCareOf && <div>c/o {data.inCareOf}</div>}
              <div>{data.address1}</div>
              <div>{data.address2}</div>
              <div>{data.address3}</div>
              <div>
                {data.city && <span>{data.city}, </span>}
                {data.state} {data.postalCode}
                {data.countryType !== COUNTRY_TYPES.DOMESTIC &&
                  data.country && <div>{data.country}</div>}
                {options.isAddressAndPhoneChange && (
                  <div className="extra-margin-top">{data.phone}</div>
                )}
              </div>
            </td>
          )}
        </tr>
      </tbody>
    </table>
  );
};

type ChangeOfAddressOptions = {
  caseCaptionExtension: string;
  caseTitle: string;
  docketNumberWithSuffix: string;
  h3: string;
  isEmailChange: boolean;
  isPhoneChangeOnly: boolean;
  isAddressChange: boolean;
  isAddressAndPhoneChange: boolean;
};

type ChangeOfAddressContactInfo = {
  caseCaptionExtension: string;
  caseTitle: string;
  docketNumberWithSuffix: string;
  h3: string;
  email: string;
  phone: string;
  inCareOf?: string;
  address1: string;
  address2: string;
  address3: string;
  city?: string;
  state: string;
  postalCode: string;
  countryType: string;
  country?: string;
};

export type ChangeOfAddressParams = {
  name: string;
  options: ChangeOfAddressOptions;
  newData: ChangeOfAddressContactInfo;
  oldData: ChangeOfAddressContactInfo;
};

export const ChangeOfAddress = ({
  name,
  newData,
  oldData,
  options,
}: ChangeOfAddressParams) => {
  return (
    <>
      <PrimaryHeader />
      <DocketHeader
        caseCaptionExtension={options.caseCaptionExtension}
        caseTitle={options.caseTitle}
        docketNumberWithSuffix={options.docketNumberWithSuffix}
        documentTitle={options.h3}
      />

      <p className="please-change">
        Please change the contact information for {name} on the records of the
        Court.
      </p>
      <div>
        {renderTable({ data: oldData, label: 'Old', options })}
        <br />
        {renderTable({ data: newData, label: 'New', options })}
      </div>
    </>
  );
};
