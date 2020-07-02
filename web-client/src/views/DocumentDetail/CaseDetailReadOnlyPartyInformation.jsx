import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const CaseDetailReadOnlyPartyInformation = connect(
  {
    caseDetailEditContactsHelper: state.caseDetailEditContactsHelper,
    caseDetailEditHelper: state.caseDetailEditHelper,
    constants: state.constants,
    formattedCaseDetail: state.formattedCaseDetail,
  },
  function CaseDetailReadOnlyPartyInformation({
    caseDetailEditContactsHelper,
    caseDetailEditHelper,
    constants,
    formattedCaseDetail,
  }) {
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
          {contact.email && (
            <p>
              {contact.email}{' '}
              {contact.hasEAccess && (
                <FontAwesomeIcon
                  className="margin-left-05 fa-icon-blue"
                  icon="flag"
                  size="1x"
                />
              )}
            </p>
          )}
        </React.Fragment>
      );
    };
    return (
      <div className="blue-container read-only-party-information">
        <h3>Party Information</h3>
        <div>
          <span className="label">Party type</span>
          <p>{formattedCaseDetail.partyType || 'My Party type'}</p>
        </div>

        {caseDetailEditHelper.showPrimaryContact && (
          <div className="read-only-contact-information">
            <span className="label" id="primary-label">
              {caseDetailEditContactsHelper.contactPrimary.header}
            </span>
            <div>
              <address aria-labelledby="primary-label">
                {addressDisplay(formattedCaseDetail.contactPrimary)}
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
                {formattedCaseDetail.contactSecondary.name &&
                  addressDisplay(formattedCaseDetail.contactSecondary)}
              </address>
            </div>
          </div>
        )}
      </div>
    );
  },
);
