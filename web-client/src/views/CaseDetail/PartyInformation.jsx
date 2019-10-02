import { AddPractitionerModal } from './AddPractitionerModal';
import { AddRespondentModal } from './AddRespondentModal';
import { Button } from '../../ustc-ui/Button/Button';
import { EditSecondaryContactModal } from '../EditSecondaryContactModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

const AddressDisplay = (contact, constants, { nameOverride } = {}) => {
  return (
    <React.Fragment>
      <p className="margin-top-0 address-name">
        {nameOverride || contact.name}{' '}
        {contact.barNumber && `(${contact.barNumber})`}
        {contact.inCareOf && (
          <span>
            <br />
            c/o {contact.inCareOf}
          </span>
        )}
      </p>
      <p>
        <span className="address-line">{contact.address1}</span>
        {contact.address2 && (
          <span className="address-line">{contact.address2}</span>
        )}
        {contact.address3 && (
          <span className="address-line">{contact.address3}</span>
        )}
        <span className="address-line">
          {contact.city && `${contact.city}, `}
          {contact.state} {contact.postalCode}
        </span>
        {contact.countryType === constants.COUNTRY_TYPES.INTERNATIONAL && (
          <span className="address-line">{contact.country}</span>
        )}
        {contact.phone && (
          <span className="address-line margin-top-1">{contact.phone}</span>
        )}
      </p>
    </React.Fragment>
  );
};

const PartyInformation = connect(
  {
    caseDetailHelper: state.caseDetailHelper,
    constants: state.constants,
    form: state.form,
    formattedCaseDetail: state.formattedCaseDetail,
    openAddPractitionerModalSequence:
      sequences.openAddPractitionerModalSequence,
    openAddRespondentModalSequence: sequences.openAddRespondentModalSequence,
    openEditSecondaryContactModalSequence:
      sequences.openEditSecondaryContactModalSequence,
    showModal: state.showModal,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state.validationErrors,
  },
  ({
    caseDetailHelper,
    constants,
    form,
    formattedCaseDetail,
    openAddPractitionerModalSequence,
    openAddRespondentModalSequence,
    openEditSecondaryContactModalSequence,
    showModal,
    updateFormValueSequence,
    validationErrors,
  }) => {
    const mainPartyInformation = () => (
      <div className="grid-container padding-x-0">
        <div className="grid-row">
          <div className="tablet:grid-col-3">
            {formattedCaseDetail.contactPrimary && (
              <div>
                <address aria-labelledby="primary-label">
                  {AddressDisplay(
                    formattedCaseDetail.contactPrimary,
                    constants,
                    {
                      nameOverride:
                        caseDetailHelper.showCaseNameForPrimary &&
                        formattedCaseDetail.caseName,
                    },
                  )}
                </address>

                {caseDetailHelper.showEditPrimaryContactButton && (
                  <p>
                    <Button
                      link
                      href={`/case-detail/${formattedCaseDetail.docketNumber}/contacts/primary/edit`}
                    >
                      <FontAwesomeIcon icon="edit" size="sm" />
                      Edit
                    </Button>
                  </p>
                )}
                {formattedCaseDetail.contactPrimary.serviceIndicator && (
                  <div className="margin-top-4">
                    <span className="semi-bold">Service: </span>
                    {formattedCaseDetail.contactPrimary.serviceIndicator}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="tablet:grid-col-3">
            {formattedCaseDetail.contactSecondary &&
              formattedCaseDetail.contactSecondary.name && (
                <div>
                  <address aria-labelledby="secondary-label">
                    {formattedCaseDetail.contactSecondary.name &&
                      AddressDisplay(
                        formattedCaseDetail.contactSecondary,
                        constants,
                        {},
                      )}
                  </address>
                  {caseDetailHelper.showEditContactButton && (
                    <Button
                      link
                      onClick={() => openEditSecondaryContactModalSequence()}
                    >
                      <FontAwesomeIcon icon="question-circle" size="sm" />
                      Why can’t I edit this?
                    </Button>
                  )}
                  {formattedCaseDetail.contactSecondary.serviceIndicator && (
                    <div className="margin-top-4">
                      <span className="semi-bold">Service: </span>
                      {formattedCaseDetail.contactSecondary.serviceIndicator}
                    </div>
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
          {formattedCaseDetail.practitioners &&
            formattedCaseDetail.practitioners.map((practitioner, index) => (
              <div
                className={`tablet:grid-col-3 ${
                  index > 3 ? 'margin-top-3' : ''
                }`}
                key={index}
              >
                <address aria-labelledby="practitioner-label">
                  {practitioner.name &&
                    AddressDisplay(
                      {
                        ...practitioner,
                        ...practitioner.contact,
                      },
                      constants,
                      {
                        nameOverride: practitioner.name,
                      },
                    )}
                </address>
                {practitioner.serviceIndicator && (
                  <div className="margin-top-4">
                    <span className="semi-bold">Service: </span>
                    {practitioner.serviceIndicator}
                  </div>
                )}
                <p className="label representing-label margin-top-2">
                  Representing
                </p>
                {practitioner.representingPrimary &&
                  formattedCaseDetail.contactPrimary.name}
                {practitioner.representingPrimary &&
                  practitioner.representingSecondary && <br />}
                {practitioner.representingSecondary &&
                  formattedCaseDetail.contactSecondary &&
                  formattedCaseDetail.contactSecondary.name}
              </div>
            ))}
        </div>
      </div>
    );

    const respondentPartyInformation = () => (
      <div className="grid-container padding-x-0">
        <div className="grid-row">
          {formattedCaseDetail.respondents &&
            formattedCaseDetail.respondents.map((respondent, index) => (
              <div
                className={`tablet:grid-col-3 ${
                  index > 3 ? 'margin-top-3' : ''
                }`}
                key={index}
              >
                <address aria-labelledby="respondent-label">
                  {respondent.name &&
                    AddressDisplay(
                      {
                        ...respondent,
                        ...respondent.contact,
                      },
                      constants,
                      {
                        nameOverride: respondent.name,
                      },
                    )}
                </address>
                {respondent.serviceIndicator && (
                  <div className="margin-top-4">
                    <span className="semi-bold">Service: </span>
                    {respondent.serviceIndicator}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    );

    const practitionerSearch = () => (
      <>
        <div className="grid-col-3 text-right">
          <span
            className="label margin-right-4 margin-top-05"
            id="practitioner-counsel-search-description"
          >
            Add Counsel
          </span>
        </div>
        <div className="grid-col-3 margin-top-neg-05">
          <div
            className={`usa-form-group ${
              validationErrors.practitionerSearchError
                ? 'usa-form-group--error margin-bottom-2'
                : 'margin-bottom-0'
            }`}
          >
            <form
              className="usa-search"
              onSubmit={e => {
                e.preventDefault();
                openAddPractitionerModalSequence();
              }}
            >
              <div role="search">
                <label
                  className="usa-sr-only"
                  htmlFor="practitioner-search-field"
                >
                  Search
                </label>
                <input
                  aria-describedby="practitioner-counsel-search-description"
                  className={`usa-input margin-bottom-0
                    ${
                      validationErrors.practitionerSearchError
                        ? 'usa-input--error'
                        : ''
                    }`}
                  id="practitioner-search-field"
                  name="practitionerSearch"
                  placeholder="Enter Bar No. or Name"
                  type="search"
                  value={form.practitionerSearch || ''}
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                />
                <button className="usa-button" type="submit">
                  <span className="usa-search__submit-text">Search</span>
                </button>
              </div>
              <Text
                bind="validationErrors.practitionerSearchError"
                className="usa-error-message"
              />
            </form>
          </div>
        </div>
      </>
    );

    const respondentSearch = () => (
      <>
        <div className="grid-col-3 text-right">
          <span
            className="label margin-right-4 margin-top-05"
            id="respondent-counsel-search-description"
          >
            Add Counsel
          </span>
        </div>
        <div className="grid-col-3 margin-top-neg-05">
          <div
            className={`usa-form-group ${
              validationErrors.respondentSearchError
                ? 'usa-form-group--error margin-bottom-2'
                : 'margin-bottom-0'
            }`}
          >
            <form
              className="usa-search"
              onSubmit={e => {
                e.preventDefault();
                openAddRespondentModalSequence();
              }}
            >
              <div role="search">
                <label
                  className="usa-sr-only"
                  htmlFor="respondent-search-field"
                >
                  Search
                </label>
                <input
                  aria-describedby="respondent-counsel-search-description"
                  className={`usa-input margin-bottom-0
                  ${
                    validationErrors.respondentSearchError
                      ? 'usa-input--error'
                      : ''
                  }`}
                  id="respondent-search-field"
                  name="respondentSearch"
                  placeholder="Enter Bar No. or Name"
                  type="search"
                  value={form.respondentSearch || ''}
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                />
                <button className="usa-button" type="submit">
                  <span className="usa-search__submit-text">Search</span>
                </button>
              </div>
              <Text
                bind="validationErrors.respondentSearchError"
                className="usa-error-message"
              />
            </form>
          </div>
        </div>
      </>
    );

    return (
      <>
        <div className="subsection party-information">
          <div className="card">
            <div className="content-wrapper">
              <h3 className="underlined" id="primary-label">
                {formattedCaseDetail.partyType || 'My Party Type'}
              </h3>
              {mainPartyInformation()}
            </div>
          </div>
        </div>
        {caseDetailHelper.showPractitionerSection && (
          <div className="subsection party-information">
            <div className="card">
              <div className="content-wrapper">
                <div className="grid-row header-row">
                  <div className="grid-col-6" id="practitioner-label">
                    <h3>Petitioner Counsel</h3>
                  </div>
                  {caseDetailHelper.showAddCounsel && practitionerSearch()}
                </div>
                {practitionerPartyInformation()}
              </div>
            </div>
          </div>
        )}
        {caseDetailHelper.showRespondentSection && (
          <div className="subsection party-information">
            <div className="card">
              <div className="content-wrapper">
                <div className="grid-row header-row">
                  <div className="grid-col-6" id="secondary-label">
                    <h3>Respondent Counsel</h3>
                  </div>
                  {caseDetailHelper.showAddCounsel && respondentSearch()}
                </div>
                {respondentPartyInformation()}
              </div>
            </div>
          </div>
        )}
        {caseDetailHelper.showEditSecondaryContactModal && (
          <EditSecondaryContactModal />
        )}
        {showModal === 'AddPractitionerModal' && <AddPractitionerModal />}
        {showModal === 'AddRespondentModal' && <AddRespondentModal />}
      </>
    );
  },
);

export { AddressDisplay, PartyInformation };
