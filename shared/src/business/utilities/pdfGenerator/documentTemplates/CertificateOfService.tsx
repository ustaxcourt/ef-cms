import React from 'react';
import { AddressLabel } from '../components/AddressLabel';
import { UserContact } from '@shared/business/entities/User';
import { RawContact } from '@shared/business/entities/contacts/Contact';
type CertificateOfServiceParams = {
  date: string;
  partyInformation: RawContact;
  practitionerInformation: {
    contact: UserContact;
    barNumber: string;
    email: string;
    name: string;
  };
};
export const CertificateOfService = ({
  date,
  partyInformation,
  practitionerInformation,
}: CertificateOfServiceParams) => {
  const partyFullAddress = partyInformation.isAddressSealed
    ? 'ADDRESS SEALED BY COURT ORDER'
    : [
        partyInformation.address1,
        partyInformation.address2,
        partyInformation.address3,
        partyInformation.city,
        partyInformation.state,
        partyInformation.postalCode,
        partyInformation.country,
      ]
        .filter(Boolean)
        .join(', ');

  return (
    <div id="certificate-of-service-pdf">
      <h2 className="cos-header">Certificate of Service</h2>
      <p className="indent-paragraph cos-paragraph">
        This is to certify that a copy of the foregoing paper was served on{' '}
        {partyInformation.name} by (delivering the same to{' '}
        {partyInformation.name} at {partyFullAddress} on {date}) or (mailing the
        same on {date} in a postage-paid wrapper addressed to{' '}
        {partyInformation.name} at {partyFullAddress}
        ).
      </p>
      <div className="cos-practitioner-info">
        <div className="width-50">Dated: {date}</div>
        <div className="width-50">
          <AddressLabel
            address1={practitionerInformation.contact.address1}
            address2={practitionerInformation.contact.address2}
            address3={practitionerInformation.contact.address3}
            city={practitionerInformation.contact.city}
            country={practitionerInformation.contact.country}
            countryType={practitionerInformation.contact.countryType}
            name={practitionerInformation.name}
            postalCode={practitionerInformation.contact.postalCode}
            state={practitionerInformation.contact.state}
          />
          <div>{practitionerInformation.contact.phone}</div>
          <div>Tax Court Bar No. {practitionerInformation.barNumber}</div>
          <div>{practitionerInformation.email}</div>
        </div>
      </div>
    </div>
  );
};
