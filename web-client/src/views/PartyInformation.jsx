import React from 'react';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';

export const PartyInformation = connect(
  {
    caseDetail: state.formattedCaseDetail,
    constants: state.constants,
  },
  ({ caseDetail, constants }) => {
    const addressDisplay = contact => {
      return (
        <React.Fragment>
          <p>{contact.name}</p>
          {contact.title && <p>{contact.title}</p>}
          <p>
            <span className="address-line">{contact.address1}</span>
            <span className="address-line">{contact.address2}</span>
            {contact.address3 && (
              <span className="address-line">{contact.address3}</span>
            )}
            <span className="address-line">
              {contact.city && `${contact.city}, `}
              {contact.state} {contact.postalCode}
            </span>
            <span className="address-line">
              {contact.countryType === constants.COUNTRY_TYPES.INTERNATIONAL &&
                contact.country}
            </span>
          </p>
          {contact.phone && <p>{contact.phone}</p>}
          {contact.email && <p>{contact.email}</p>}
        </React.Fragment>
      );
    };
    return (
      <div className="subsection party-information">
        <h3 className="underlined">Party Information</h3>
        <div className="usa-grid-full">
          <div className="usa-width-one-sixth">
            <p className="label">Party Type</p>
            <p>{caseDetail.partyType || 'My Party Type'}</p>
          </div>

          <div className="usa-width-one-sixth">
            {caseDetail.contactPrimary && (
              <React.Fragment>
                <p className="label" id="primary-label">
                  Primary Contact
                </p>
                <div>
                  <address aria-labelledby="primary-label">
                    {addressDisplay(caseDetail.contactPrimary)}
                  </address>
                </div>
              </React.Fragment>
            )}{' '}
          </div>
          <div className="usa-width-one-sixth">
            {caseDetail.contactSecondary &&
              caseDetail.contactSecondary.name && (
                <React.Fragment>
                  <p className="label" id="secondary-label">
                    Secondary Contact
                  </p>
                  <div>
                    <address aria-labelledby="secondary-label">
                      {caseDetail.contactSecondary.name &&
                        addressDisplay(caseDetail.contactSecondary)}
                    </address>
                  </div>
                </React.Fragment>
              )}{' '}
          </div>
          <div className="usa-width-one-sixth">
            {caseDetail.practitioner && (
              <React.Fragment>
                <p className="label" id="petitioner-label">
                  Petitioner Counsel
                </p>
                <div>
                  <address aria-labelledby="petitioner-label">
                    {caseDetail.practitioner.name &&
                      addressDisplay({
                        ...caseDetail.practitioner,
                        name: caseDetail.practitioner.formattedName,
                        address1: caseDetail.practitioner.address,
                      })}
                  </address>
                </div>
              </React.Fragment>
            )}{' '}
          </div>
          <div className="usa-width-one-sixth">
            {caseDetail.respondent && (
              <React.Fragment>
                <p className="label" id="respondent-label">
                  Respondent Information
                </p>
                <address aria-labelledby="respondent-label">
                  {addressDisplay({
                    ...caseDetail.respondent,
                    name: caseDetail.respondent.formattedName,
                    address1: caseDetail.respondent.addressLine1,
                    address2: caseDetail.respondent.addressLine2,
                    address3: caseDetail.respondent.addressLine3,
                  })}
                </address>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    );
  },
);
