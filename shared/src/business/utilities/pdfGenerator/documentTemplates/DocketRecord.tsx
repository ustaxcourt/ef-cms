import { CompressedDocketHeader } from '@shared/business/utilities/pdfGenerator/components/CompressedDocketHeader';
import { PrimaryHeader } from '@shared/business/utilities/pdfGenerator/components/PrimaryHeader';
import React from 'react';
import classNames from 'classnames';
import type { FormattedDocketEntry } from '@web-client/presenter/computeds/formattedDocketEntries';

type PetitionerContact = TPetitioner & {
  index: number;
  counselDetails: { [k: string]: string }[];
};
type CountryTypes = { DOMESTIC: string; INTERNATIONAL: string };
type RenderAddressProps = React.HTMLAttributes<HTMLDivElement> & {
  contact: PetitionerContact;
  countryTypes: CountryTypes;
};
type RenderContactProps = React.HTMLAttributes<HTMLDivElement> & {
  caseTitle: string;
  contact: PetitionerContact;
  countryTypes: CountryTypes;
  showContactDetails: boolean;
};

const RenderAddress = ({
  contact,
  countryTypes,
}: RenderAddressProps): React.JSX.Element => {
  const isInternational = contact.countryType === countryTypes.INTERNATIONAL;

  return (
    <>
      {contact.address1 && <div>{contact.address1}</div>}
      {contact.address2 && <div>{contact.address2}</div>}
      {contact.address3 && <div>{contact.address3}</div>}
      <div>
        {contact.city && <span>{contact.city}, </span>}
        {contact.state && <span>{contact.state} </span>}
        {contact.postalCode && <span>{contact.postalCode}</span>}
      </div>
      {isInternational && <span>{contact.country}</span>}
      {contact.phone && <p className="margin-top-5">{contact.phone}</p>}
    </>
  );
};

const RenderContact = ({
  contact,
  countryTypes,
  showContactDetails,
}: RenderContactProps): React.JSX.Element => {
  return (
    <>
      <tbody>
        <tr className="party-details" key={contact.index}>
          <td>
            {contact.name}
            {contact.additionalName && <div>{contact.additionalName}</div>}
          </td>
          {!contact.isAddressSealed && showContactDetails && (
            <td>
              <RenderAddress
                className="address-info"
                contact={contact}
                countryTypes={countryTypes}
              />
            </td>
          )}
          {contact.isAddressSealed && showContactDetails && (
            <td>
              <p className="address-sealed-text">Address sealed</p>
            </td>
          )}

          <td>
            {contact.counselDetails.map(practitioner => {
              return (
                <div
                  className="practitioner-contact"
                  key={practitioner.email + contact.contactId}
                >
                  <p className="margin-top-0 margin-bottom-0">
                    {practitioner.name}
                  </p>
                  <p className="margin-top-5 margin-bottom-0">
                    {practitioner.email}
                  </p>
                  <p className="margin-top-5">{practitioner.phone}</p>
                </div>
              );
            })}
          </td>
        </tr>
      </tbody>
    </>
  );
};

const RecordDescription = ({
  entry,
}: {
  entry: FormattedDocketEntry;
}): React.JSX.Element => {
  return (
    <>
      <span
        className={classNames(
          'filings-and-proceedings',
          entry.isStricken && 'stricken-docket-record',
        )}
      >
        {entry.descriptionDisplay}
        {entry.relatedDocketEntries?.length ? (
          <>
            <br />
            {entry.relatedDocketEntries.map((affectedEntry, index) => (
              <div key={index}>
                {affectedEntry.dispositionText.map(dispositionText => (
                  <div key={dispositionText}>--- {dispositionText}</div>
                ))}
              </div>
            ))}
          </>
        ) : null}
      </span>
      {entry.isStricken && <span> (STRICKEN)</span>}
    </>
  );
};

const ServedDate = ({
  document,
}: {
  document: FormattedDocketEntry;
}): React.JSX.Element | string => {
  const documentDateServed =
    document && document.isStatusServed ? document.servedAtFormatted : '';

  if (documentDateServed) {
    const arrDateServed = documentDateServed.split(' ');

    return (
      <>
        {arrDateServed[0]}{' '}
        <span className="no-wrap">{arrDateServed.slice(1).join(' ')}</span>
      </>
    );
  } else if (document && document.isNotServedDocument) {
    return 'Not served';
  } else {
    return '';
  }
};

export const DocketRecord = ({
  caseDetail,
  countryTypes,
  entries,
  options,
}): React.JSX.Element => {
  return (
    <div id="document-docket-record">
      <PrimaryHeader />
      <CompressedDocketHeader
        caseCaptionExtension={options.caseCaptionExtension}
        caseTitle={options.caseTitle}
        docketNumberWithSuffix={options.docketNumberWithSuffix}
        documentTitle="Printable Docket Record"
      />

      <div className="party-info" id="petitioner-contacts">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              {options.includePartyDetail && <th>Contact</th>}
              <th>Counsel</th>
            </tr>
          </thead>
          {caseDetail.petitioners.map(p => {
            return (
              <RenderContact
                caseTitle={options.caseTitle}
                contact={p}
                countryTypes={countryTypes}
                key={p.contactId}
                showContactDetails={options.includePartyDetail}
              />
            );
          })}
        </table>
      </div>

      <div className="party-info" id="irs-practitioner-contacts">
        <table>
          <thead>
            <tr>
              <th>Respondent Counsel</th>
              <th>Respondent Counsel Contact</th>
            </tr>
          </thead>

          <tbody>
            {caseDetail.irsPractitioners.length > 0 ? (
              caseDetail.irsPractitioners.map(irsPractitioner => {
                return (
                  <tr key={irsPractitioner.userId}>
                    <td>{irsPractitioner.name}</td>
                    <td>
                      <div>
                        {irsPractitioner.email && irsPractitioner.email}
                      </div>
                      <div>
                        {irsPractitioner.contact?.phone &&
                          irsPractitioner.contact.phone}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td>None</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <table id="documents">
        <thead>
          <tr>
            <th>No.</th>
            <th>Date</th>
            <th>Event</th>
            <th></th>
            <th>Filings and proceedings</th>
            <th>Filed by</th>
            <th>Action</th>
            <th>Served</th>
            <th>Parties</th>
          </tr>
        </thead>
        <tbody>
          {entries &&
            entries.map(entry => {
              return (
                <tr key={entry.index}>
                  <td>{entry.index}</td>
                  <td
                    className={classNames(
                      entry.isStricken && 'stricken-docket-record',
                    )}
                  >
                    {entry.createdAtFormatted || ''}
                  </td>
                  <td>{entry.eventCode || ''}</td>
                  <td className="padding-top-1">
                    {entry.isSealed && <div className="sealed-icon" />}
                  </td>
                  <td className="filings-and-proceedings">
                    <RecordDescription entry={entry} />
                  </td>
                  <td>{entry.filedBy || ''}</td>
                  <td>{entry.action || ''}</td>
                  <td>
                    <ServedDate document={entry} />
                  </td>
                  <td>{entry.servedPartiesCode || ''}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};
