const React = require('react');

const CompressedDocketHeader = require('../components/CompressedDocketHeader.jsx')
  .default;
const PrimaryHeader = require('../components/PrimaryHeader.jsx').default;

const RenderAddress = ({ contact }) => {
  // TODO: Refactor this
  const isInternational = contact.countryType === 'international';

  return (
    <>
      {contact.inCareOf && <div>{contact.inCareOf}</div>}
      {contact.title && <div>{contact.title}</div>}
      {contact.address1 && <div>{contact.address1}</div>}
      {contact.address2 && <div>{contact.address2}</div>}
      {contact.address3 && <div>{contact.address3}</div>}
      <div>
        {contact.city && <span>{contact.city}, </span>}
        {contact.state && <span>{contact.state}, </span>}
        {contact.postalCode && <span>{contact.postalCode}</span>}
      </div>
      {isInternational && <span>{contact.country}</span>}
      {contact.phone && <p>{contact.phone}</p>}
    </>
  );
};

const RenderContact = ({ caseTitle, contact, showCaseTitleForPrimary }) => {
  const name = showCaseTitleForPrimary ? caseTitle : contact.name;

  return (
    <div className="party-details">
      <p>{name}</p>
      <RenderAddress contact={contact} />
    </div>
  );
};

const RenderPractitioner = ({
  contactPrimary,
  contactSecondary,
  practitioner,
}) => {
  const { representingPrimary, representingSecondary } = practitioner;
  const showRepresentingPrimary = representingPrimary && contactPrimary;
  const showRepresentingSecondary =
    representingSecondary && contactSecondary && contactSecondary.name;

  return (
    <div className="party-details">
      <p>{practitioner.formattedName}</p>
      <RenderAddress
        contact={{
          ...practitioner.contact,
          name: practitioner.name,
        }}
      />

      {(showRepresentingPrimary || showRepresentingSecondary) && (
        <p>
          <strong>Representing</strong>
          <br />
          {showRepresentingPrimary && <div>{contactPrimary.name}</div>}
          {showRepresentingSecondary && <div>{contactSecondary.name}</div>}
        </p>
      )}
    </div>
  );
};

const DocketRecord = ({ caseDetail, entries, options }) => {
  return (
    <div id="document-docket-record">
      <PrimaryHeader />
      <CompressedDocketHeader
        caseCaptionExtension={options.caseCaptionExtension}
        caseTitle={options.caseTitle}
        docketNumberWithSuffix={options.docketNumberWithSuffix}
      />

      <div className="party-info">
        <div className="party-info-header">{caseDetail.partyType}</div>
        <div className="party-info-content">
          <RenderContact
            caseTitle={options.caseTitle}
            contact={caseDetail.contactPrimary}
            showCaseTitleForPrimary={caseDetail.showCaseTitleForPrimary}
          />
          {caseDetail.contactSecondary && (
            <RenderContact contact={caseDetail.contactSecondary} />
          )}
        </div>
      </div>

      {caseDetail.privatePractitioners.length > 0 && (
        <div className="party-info">
          <div className="party-info-header">Petitioner Counsel</div>
          <div className="party-info-content">
            {caseDetail.privatePractitioners.map(practitioner => {
              if (practitioner.formattedName) {
                return (
                  <RenderPractitioner
                    contactPrimary={caseDetail.contactPrimary}
                    contactSecondary={caseDetail.contactSecondary}
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
        <div className="party-info">
          <div className="party-info-header">Respondent Counsel</div>
          <div className="party-info-content">
            {caseDetail.irsPractitioners.map(practitioner => {
              return (
                <RenderPractitioner
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
              const servedAtFormatted =
                document && document.isStatusServed
                  ? document.servedAtFormatted || ''
                  : '';
              const documentDateServed =
                document && document.isNotServedCourtIssuedDocument
                  ? 'Not Served'
                  : servedAtFormatted;

              return (
                <tr key={index}>
                  <td>{index}</td>
                  <td>{record.createdAtFormatted || ''}</td>
                  <td>{(document && document.eventCode) || ''}</td>
                  <td>
                    <strong>{record.description}</strong>{' '}
                    {record.filingsAndProceedings &&
                      record.filingsAndProceedings}
                  </td>
                  <td>{(document && document.filedBy) || ''}</td>
                  <td>{record.action || ''}</td>
                  <td>{documentDateServed}</td>
                  <td>{(document && document.servedPartiesCode) || ''}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default DocketRecord;
