import { AddPractitionerModal } from './AddPractitionerModal';
import { Button } from '../../ustc-ui/Button/Button';
import { EditPractitionersModal } from './EditPractitionersModal';
import { EditSecondaryContactModal } from '../EditSecondaryContactModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { PractitionerExistsModal } from './PractitionerExistsModal';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

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

const PetitionerInformation = connect(
  {
    caseDetailHelper: state.caseDetailHelper,
    caseInformationHelper: state.caseInformationHelper,
    constants: state.constants,
    form: state.form,
    formattedCaseDetail: state.formattedCaseDetail,
    openAddPractitionerModalSequence:
      sequences.openAddPractitionerModalSequence,
    openEditPractitionersModalSequence:
      sequences.openEditPractitionersModalSequence,
    openEditSecondaryContactModalSequence:
      sequences.openEditSecondaryContactModalSequence,
    showModal: state.showModal,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state.validationErrors,
  },
  ({
    caseDetailHelper,
    caseInformationHelper,
    constants,
    form,
    formattedCaseDetail,
    openAddPractitionerModalSequence,
    openEditPractitionersModalSequence,
    openEditSecondaryContactModalSequence,
    showModal,
    updateFormValueSequence,
    validationErrors,
  }) => {
    const mainPartyInformation = () => (
      <div className="grid-row grid-gap-6">
        <div className="tablet:grid-col-4">
          <div className="card height-full">
            <div className="content-wrapper">
              <h3 className="underlined" id="primary-label">
                Petitioner Contact Info
                {caseDetailHelper.showEditContacts && (
                  <Button
                    link
                    className="push-right margin-right-0 margin-top-neg-1 ustc-button--mobile-inline margin-left-2"
                    href={`/case-detail/${formattedCaseDetail.docketNumber}/contacts/primary/edit`}
                    icon="edit"
                  >
                    Edit
                  </Button>
                )}
              </h3>
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
                  {formattedCaseDetail.contactPrimary.serviceIndicator && (
                    <div className="margin-top-4">
                      <p className="semi-bold margin-bottom-0">
                        Service preference
                      </p>
                      {formattedCaseDetail.contactPrimary.serviceIndicator}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {formattedCaseDetail.contactSecondary &&
          formattedCaseDetail.contactSecondary.name && (
            <div className="tablet:grid-col-4">
              <div className="card height-full">
                <div className="content-wrapper">
                  <h3 className="underlined" id="primary-label">
                    Spouse Contact Info
                    {caseDetailHelper.showEditContacts && (
                      <Button
                        link
                        className="push-right margin-right-0 margin-top-neg-1 ustc-button--mobile-inline margin-left-2"
                        icon="question-circle"
                        onClick={() => openEditSecondaryContactModalSequence()}
                      >
                        Why can’t I edit this?
                      </Button>
                    )}
                  </h3>
                  <div>
                    <address aria-labelledby="secondary-label">
                      {formattedCaseDetail.contactSecondary.name &&
                        AddressDisplay(
                          formattedCaseDetail.contactSecondary,
                          constants,
                          {},
                        )}
                    </address>
                    {formattedCaseDetail.contactSecondary.serviceIndicator && (
                      <div className="margin-top-4">
                        <p className="semi-bold margin-bottom-0">
                          Service preference
                        </p>
                        {formattedCaseDetail.contactSecondary.serviceIndicator}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>
    );

    const practitionerPartyInformation = () => (
      <div className="grid-container padding-x-0">
        <div className="grid-row">
          {formattedCaseDetail.practitioners &&
            formattedCaseDetail.practitioners.map((practitioner, index) => (
              <div
                className={classNames(
                  'tablet:grid-col-3 counsel-information',
                  index > 3 && 'margin-top-3',
                )}
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

    const practitionerSearch = () => (
      <>
        <div className="grid-col-3 text-right">
          <span
            className="label margin-right-4 margin-top-05"
            id="practitioner-counsel-search-description"
          >
            Add counsel
          </span>
        </div>
        <div className="grid-col-3 margin-top-neg-05">
          <FormGroup
            className="margin-bottom-0"
            errorText={validationErrors.practitionerSearchError}
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
                  className={classNames(
                    'usa-input margin-bottom-0',
                    validationErrors.practitionerSearchError &&
                      'usa-input--error',
                  )}
                  id="practitioner-search-field"
                  name="practitionerSearch"
                  placeholder="Enter bar no. or name"
                  type="search"
                  value={form.practitionerSearch || ''}
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                />
                <button
                  className="usa-button"
                  id="search-for-practitioner"
                  type="submit"
                >
                  <span className="usa-search__submit-text">Search</span>
                </button>
              </div>
            </form>
          </FormGroup>
        </div>
      </>
    );

    return (
      <>
        <div className="subsection party-information">
          {mainPartyInformation()}
        </div>
        {caseDetailHelper.showPractitionerSection && (
          <div className="subsection party-information">
            <div className="card">
              <div className="content-wrapper">
                <div className="grid-row header-row">
                  <div
                    className="grid-col-6 display-flex"
                    id="practitioner-label"
                  >
                    <h3>Petitioner Counsel</h3>
                    {caseInformationHelper.showEditPractitioners && (
                      <Button
                        link
                        className="margin-left-205 padding-0 height-3"
                        id="edit-practitioners-button"
                        onClick={() => openEditPractitionersModalSequence()}
                      >
                        <FontAwesomeIcon icon="edit" size="sm" />
                        Edit
                      </Button>
                    )}
                  </div>
                  {caseInformationHelper.showAddCounsel && practitionerSearch()}
                </div>
                {practitionerPartyInformation()}
              </div>
            </div>
          </div>
        )}
        {caseDetailHelper.showEditSecondaryContactModal && (
          <EditSecondaryContactModal />
        )}
        {showModal === 'AddPractitionerModal' && <AddPractitionerModal />}
        {showModal === 'EditPractitionersModal' && <EditPractitionersModal />}
        {showModal === 'PractitionerExistsModal' && <PractitionerExistsModal />}
      </>
    );
  },
);

export { AddressDisplay, PetitionerInformation };
