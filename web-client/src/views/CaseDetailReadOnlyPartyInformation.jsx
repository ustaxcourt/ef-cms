import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const CaseDetailReadOnlyPartyInformation = connect(
  {
    caseDetail: state.formattedCaseDetail,
    caseDetailEditContactsHelper: state.caseDetailEditContactsHelper,
    caseDetailEditHelper: state.caseDetailEditHelper,
    constants: state.constants,
  },
  ({
    caseDetail,
    caseDetailEditContactsHelper,
    caseDetailEditHelper,
    constants,
  }) => {
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
              {contact.city}, {contact.state} {contact.postalCode}
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
      <div className="blue-container read-only-party-information">
        <h3>Party Information</h3>
        <div>
          <span className="label">Party Type</span>
          <p>{caseDetail.partyType || 'My Party Type'}</p>
        </div>

        {caseDetailEditHelper.showPrimaryContact && (
          <div className="read-only-contact-information">
            <span className="label" id="primary-label">
              {caseDetailEditContactsHelper.contactPrimary.header}
            </span>
            <div>
              <address aria-labelledby="primary-label">
                {addressDisplay(caseDetail.contactPrimary)}
              </address>
            </div>
          </div>
        )}
        {caseDetailEditHelper.showSecondaryContact && (
          <div className="read-only-contact-information">
            <span className="label" id="secondary-label">
              {caseDetailEditContactsHelper.contactSecondary.header}
            </span>
            <div>
              <address aria-labelledby="secondary-label">
                {caseDetail.contactSecondary.name &&
                  addressDisplay(caseDetail.contactSecondary)}
              </address>
            </div>
          </div>
        )}
      </div>
    );
  },
);
