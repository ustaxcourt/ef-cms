const classNames = require('classnames');
const React = require('react');
const {
  CompressedDocketHeader,
} = require('../components/CompressedDocketHeader.jsx');
const { PrimaryHeader } = require('../components/PrimaryHeader.jsx');

const RenderAddress = ({ contact, countryTypes }) => {
  const isInternational = contact.countryType === countryTypes.INTERNATIONAL;

  return (
    <>
      {contact.inCareOf && <div>c/o {contact.inCareOf}</div>}
      {contact.secondaryName && <div>c/o {contact.secondaryName}</div>}
      {contact.title && <div>{contact.title}</div>}
      {contact.additionalName && <div>{contact.additionalName}</div>}
      {contact.address1 && <div>{contact.address1}</div>}
      {contact.address2 && <div>{contact.address2}</div>}
      {contact.address3 && <div>{contact.address3}</div>}
      <div>
        {contact.city && <span>{contact.city}, </span>}
        {contact.state && <span>{contact.state} </span>}
        {contact.postalCode && <span>{contact.postalCode}</span>}
      </div>
      {isInternational && <span>{contact.country}</span>}
      {contact.phone && <p>{contact.phone}</p>}
    </>
  );
};

const RenderContact = ({ contact, countryTypes }) => {
  return (
    <div className="party-details">
      <div>
        {contact.isAddressSealed && (
          <div className="sealed-icon-container">
            <div className="sealed-icon" />
          </div>
        )}
        <p className="margin-bottom-0">{contact.name}</p>
        {!contact.isAddressSealed && (
          <RenderAddress contact={contact} countryTypes={countryTypes} />
        )}
        {contact.isAddressSealed && (
          <p className="address-sealed-text">Address sealed</p>
        )}
      </div>
    </div>
  );
};

const RenderPractitioner = ({ countryTypes, practitioner }) => {
  return (
    <div className="party-details">
      <p className="margin-bottom-0">
        {practitioner.formattedName || practitioner.name}
      </p>
      <RenderAddress
        contact={{
          ...practitioner.contact,
          name: practitioner.name,
        }}
        countryTypes={countryTypes}
      />
      {practitioner.representingFormatted && (
        <div className="extra-margin-top">
          <strong>Representing</strong>
          <br />
          {practitioner.representingFormatted.map(p => (
            <div key={p.name}>{p.name}</div>
          ))}
        </div>
      )}
    </div>
  );
};

const RecordDescription = ({ entry }) => {
  let additionalDescription = entry.filingsAndProceedings
    ? ` ${entry.filingsAndProceedings}`
    : '';

  if (entry.additionalInfo2) {
    additionalDescription += ` ${entry.additionalInfo2}`;
  }

  return (
    <>
      <span
        className={classNames(
          'filings-and-proceedings',
          entry.isStricken && 'stricken-docket-record',
        )}
      >
        <strong>{entry.descriptionDisplay}</strong>
        {additionalDescription}
      </span>
      {entry.isStricken && <span> (STRICKEN)</span>}
    </>
  );
};

const ServedDate = ({ document }) => {
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
}) => {
  return (
    <div id="document-docket-record">
      <PrimaryHeader />
      <CompressedDocketHeader
        caseCaptionExtension={options.caseCaptionExtension}
        caseTitle={options.caseTitle}
        docketNumberWithSuffix={options.docketNumberWithSuffix}
        h3="Printable Docket Record"
      />

      {options.includePartyDetail && (
        <div className="party-info" id="petitioner-contacts">
          <div className="party-info-header">{caseDetail.partyType}</div>
          <div className="party-info-content">
            {caseDetail.petitioners.map(p => {
              return (
                <RenderContact
                  caseTitle={options.caseTitle}
                  contact={p}
                  countryTypes={countryTypes}
                  key={p.contactId}
                />
              );
            })}
          </div>
        </div>
      )}

      <div className="party-info" id="private-practitioner-contacts">
        <div className="party-info-header">Petitioner Counsel</div>
        <div className="party-info-content">
          {caseDetail.privatePractitioners.length == 0 && 'Pro Se'}
          {caseDetail.privatePractitioners.map(practitioner => {
            if (practitioner.formattedName) {
              return (
                <RenderPractitioner
                  countryTypes={countryTypes}
                  key={practitioner.barNumber}
                  practitioner={practitioner}
                />
              );
            }
          })}
        </div>
      </div>

      <div className="party-info" id="irs-practitioner-contacts">
        <div className="party-info-header">Respondent Counsel</div>
        <div className="party-info-content">
          {caseDetail.irsPractitioners.length == 0 && 'None'}
          {caseDetail.irsPractitioners.map(practitioner => {
            return (
              <RenderPractitioner
                countryTypes={countryTypes}
                key={practitioner.barNumber}
                practitioner={practitioner}
              />
            );
          })}
        </div>
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
                    {entry.isLegacySealed && <div className="sealed-icon" />}
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
