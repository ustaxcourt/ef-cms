import React from 'react';
import { AddressLabel } from '../components/AddressLabel';
import { UserContact } from '@shared/business/entities/User';
type CertificateOfServiceParams = {
  date: string;
  partyInformation: {
    contact: UserContact;
    name: string;
  };
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
  const partyFullAddress = `${partyInformation.contact.address1}${partyInformation.contact.address2 ? `, ${partyInformation.contact.address2}` : ''}${partyInformation.contact.address3 ? `, ${partyInformation.contact.address3}` : ''}, ${partyInformation.contact.city}${partyInformation.contact.state ? `, ${partyInformation.contact.state}` : ''}${partyInformation.contact.postalCode ? `, ${partyInformation.contact.postalCode}` : ''}${partyInformation.contact.country ? `, ${partyInformation.contact.country}` : ''}`;
  return (
    <div id="certificate-of-service-pdf">
      <h2>Certificate of Service</h2>
      <p className="indent-paragraph">
        This is to certify that a copy of the foregoing paper was served on{' '}
        {partyInformation.name} by (delivering the same to{' '}
        {partyInformation.name} at {partyFullAddress} on {date}) or (mailing the
        same on {date} in a postage-paid wrapper addressed to{' '}
        {partyInformation.name} at {partyFullAddress}).
      </p>
      <div>
        <div>Dated: {date}</div>
        <div>
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
