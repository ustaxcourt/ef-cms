import { EditSecondaryContactModal } from '../EditSecondaryContactModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PartyInformation = connect(
  {
    caseDetail: state.formattedCaseDetail,
    caseHelper: state.caseDetailHelper,
    constants: state.constants,
    editSecondaryContact: sequences.openEditSecondaryContactModalSequence,
  },
  ({ caseDetail, caseHelper, constants, editSecondaryContact }) => {
    const mainPartyInformation = () => (
      <div className="grid-container padding-x-0">
        <div className="grid-row">
          <div className="tablet:grid-col-3">
            {caseDetail.contactPrimary && (
              <div>
                <address aria-labelledby={'primary-label'}>
                  {addressDisplay(caseDetail.contactPrimary, {
                    hideEmail: true,
                    nameOverride:
                      caseHelper.showCaseNameForPrimary && caseDetail.caseName,
                  })}
                </address>

                {caseHelper.showEditContactButton && (
                  <a
                    href={`/case-detail/${caseDetail.docketNumber}/contacts/primary/edit`}
                  >
                    <FontAwesomeIcon icon="edit" size="sm" />
                    Edit
                  </a>
                )}
              </div>
            )}
          </div>
          <div className="tablet:grid-col-3">
            {caseDetail.contactSecondary && caseDetail.contactSecondary.name && (
              <div>
                <address aria-labelledby={'secondary-label'}>
                  {caseDetail.contactSecondary.name &&
                    addressDisplay(caseDetail.contactSecondary, {
                      hideEmail: true,
                    })}
                </address>
                {caseHelper.showEditContactButton && (
                  <button
                    className="usa-button usa-button--unstyled"
                    onClick={() => editSecondaryContact()}
                  >
                    <FontAwesomeIcon icon="question-circle" size="sm" />
                    Why can’t I edit this?
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );

    const practitionerPartyInformation = () => (
      <div className="grid-container padding-x-0">
        <div className="grid-row">
          {caseDetail.practitioners &&
            caseDetail.practitioners.map((practitioner, index) => (
              <div
                className={`tablet:grid-col-3 ${
                  index > 3 ? 'margin-top-3' : ''
                }`}
                key={index}
              >
                <address aria-labelledby={'practitioner-label'}>
                  {practitioner.name &&
                    addressDisplay({
                      ...practitioner,
                      address1: practitioner.addressLine1,
                      address2: practitioner.addressLine2,
                      address3: practitioner.addressLine3,
                    })}
                </address>
                <p className="label representing-label margin-top-2">
                  Representing
                </p>
                {/*TODO*/}
                <p>{caseDetail.contactPrimary.name}</p>
                {caseDetail.contactSecondary && (
                  <p>{caseDetail.contactSecondary.name}</p>
                )}
              </div>
            ))}
        </div>
      </div>
    );

    const respondentPartyInformation = () => (
      <div className="grid-container padding-x-0">
        <div className="grid-row">
          {caseDetail.respondents &&
            caseDetail.respondents.map((respondent, index) => (
              <div
                className={`tablet:grid-col-3 ${
                  index > 3 ? 'margin-top-3' : ''
                }`}
                key={index}
              >
                <address aria-labelledby={'respondent-label'}>
                  {respondent.name &&
                    addressDisplay({
                      ...respondent,
                      address1: respondent.addressLine1,
                      address2: respondent.addressLine2,
                      address3: respondent.addressLine3,
                    })}
                </address>
              </div>
            ))}
        </div>
      </div>
    );

    const addressDisplay = (contact, { hideEmail, nameOverride } = {}) => {
      return (
        <React.Fragment>
          <p className="margin-top-0">
            {nameOverride || contact.name}
            {contact.inCareOf && (
              <span>
                <br />
                c/o {contact.inCareOf}
              </span>
            )}
          </p>
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
          {contact.email && !hideEmail && <p>{contact.email}</p>}
        </React.Fragment>
      );
    };

    return (
      <>
        <div className="subsection party-information">
          <div className="card">
            <div className="content-wrapper">
              <h3 className="underlined">
                {caseDetail.partyType || 'My Party Type'}
              </h3>
              {mainPartyInformation()}
            </div>
          </div>
        </div>
        <div className="subsection party-information">
          {caseDetail.practitioners && (
            <div className="card">
              <div className="content-wrapper">
                <h3 className="underlined">Petitioner Counsel</h3>
                {practitionerPartyInformation()}
              </div>
            </div>
          )}
        </div>
        <div className="subsection party-information">
          {caseDetail.respondents && (
            <div className="card">
              <div className="content-wrapper">
                <h3 className="underlined">Respondent Counsel</h3>
                {respondentPartyInformation()}
              </div>
            </div>
          )}
        </div>
        {caseHelper.showEditSecondaryContactModal && (
          <EditSecondaryContactModal />
        )}
      </>
    );
  },
);
