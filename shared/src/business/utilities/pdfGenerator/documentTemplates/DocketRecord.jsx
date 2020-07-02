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
      {contact.title && <div>{contact.title}</div>}
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

const RenderContact = ({
  caseTitle,
  contact,
  countryTypes,
  showCaseTitleForPrimary,
}) => {
  const name = showCaseTitleForPrimary ? caseTitle : contact.name;

  return (
    <div className="party-details">
      <p>{name}</p>
      <RenderAddress contact={contact} countryTypes={countryTypes} />
    </div>
  );
};

const RenderPractitioner = ({
  contactPrimary,
  contactSecondary,
  countryTypes,
  practitioner,
}) => {
  const { representingPrimary, representingSecondary } = practitioner;
  const showRepresentingPrimary = representingPrimary && contactPrimary;
  const showRepresentingSecondary =
    representingSecondary && contactSecondary && contactSecondary.name;

  return (
    <div className="party-details">
      <p>{practitioner.formattedName || practitioner.name}</p>
      <RenderAddress
        contact={{
          ...practitioner.contact,
          name: practitioner.name,
        }}
        countryTypes={countryTypes}
      />

      {(showRepresentingPrimary || showRepresentingSecondary) && (
        <div className="extra-margin-top">
          <strong>Representing</strong>
          <br />
          {showRepresentingPrimary && <div>{contactPrimary.name}</div>}
          {showRepresentingSecondary && <div>{contactSecondary.name}</div>}
        </div>
      )}
    </div>
  );
};

const RecordDescription = ({ document, record }) => {
  let additionalDescription = record.filingsAndProceedings
    ? ` ${record.filingsAndProceedings}`
    : '';

  if (document && document.additionalInfo2) {
    additionalDescription += ` ${document.additionalInfo2}`;
  }

  return (
    <>
      <strong>{record.description}</strong>
      {additionalDescription}
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
  } else if (document && document.isNotServedCourtIssuedDocument) {
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

      <div className="party-info" id="petitioner-contacts">
        <div className="party-info-header">{caseDetail.partyType}</div>
        <div className="party-info-content">
          <RenderContact
            caseTitle={options.caseTitle}
            contact={caseDetail.contactPrimary}
            countryTypes={countryTypes}
            showCaseTitleForPrimary={caseDetail.showCaseTitleForPrimary}
          />
          {caseDetail.contactSecondary && (
            <RenderContact
              contact={caseDetail.contactSecondary}
              countryTypes={countryTypes}
            />
          )}
        </div>
      </div>

      {caseDetail.privatePractitioners.length > 0 && (
        <div className="party-info" id="private-practitioner-contacts">
          <div className="party-info-header">Petitioner Counsel</div>
          <div className="party-info-content">
            {caseDetail.privatePractitioners.map(practitioner => {
              if (practitioner.formattedName) {
                return (
                  <RenderPractitioner
                    contactPrimary={caseDetail.contactPrimary}
                    contactSecondary={caseDetail.contactSecondary}
                    countryTypes={countryTypes}
                    key={practitioner.barNumber}
                    practitioner={practitioner}
                  />
                );
              }
            })}
          </div>
        </div>
      )}

      {caseDetail.irsPractitioners.length > 0 && (
        <div className="party-info" id="irs-practitioner-contacts">
          <div className="party-info-header">Respondent Counsel</div>
          <div className="party-info-content">
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
      )}

      <table id="documents">
        <thead>
          <tr>
            <th>No.</th>
            <th>Date</th>
            <th>Event</th>
            <th>Filings and proceedings</th>
            <th>Filed by</th>
            <th>Action</th>
            <th>Served</th>
            <th>Parties</th>
          </tr>
        </thead>
        <tbody>
          {entries &&
            entries.map(({ document, index, record }) => {
              return (
                <tr key={index}>
                  <td>{index}</td>
                  <td>{record.createdAtFormatted || ''}</td>
                  <td>{record.eventCode || ''}</td>
                  <td className="filings-and-proceedings">
                    <RecordDescription document={document} record={record} />
                  </td>
                  <td>{(document && document.filedBy) || ''}</td>
                  <td>{record.action || ''}</td>
                  <td>
                    <ServedDate document={document} />
                  </td>
                  <td>{(document && document.servedPartiesCode) || ''}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};
