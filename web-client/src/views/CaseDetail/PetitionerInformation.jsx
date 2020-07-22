import { AddPrivatePractitionerModal } from './AddPrivatePractitionerModal';
import { AddressDisplay } from './AddressDisplay';
import { Button } from '../../ustc-ui/Button/Button';
import { EditPrivatePractitionersModal } from './EditPrivatePractitionersModal';
import { EditSecondaryContactModal } from '../EditSecondaryContactModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { OtherPetitionerDisplay } from './OtherPetitionerDisplay';
import { PractitionerExistsModal } from './PractitionerExistsModal';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

const PetitionerInformation = connect(
  {
    caseDetailHelper: state.caseDetailHelper,
    caseInformationHelper: state.caseInformationHelper,
    form: state.form,
    formattedCaseDetail: state.formattedCaseDetail,
    openAddPrivatePractitionerModalSequence:
      sequences.openAddPrivatePractitionerModalSequence,
    openEditPrivatePractitionersModalSequence:
      sequences.openEditPrivatePractitionersModalSequence,
    showModal: state.modal.showModal,
    toggleShowAdditionalPetitionersSequence:
      sequences.toggleShowAdditionalPetitionersSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state.validationErrors,
  },
  function PetitionerInformation({
    caseDetailHelper,
    caseInformationHelper,
    form,
    formattedCaseDetail,
    openAddPrivatePractitionerModalSequence,
    openEditPrivatePractitionersModalSequence,
    showModal,
    toggleShowAdditionalPetitionersSequence,
    updateFormValueSequence,
    validationErrors,
  }) {
    const mainPartyInformation = () => (
      <div className="grid-row grid-gap-6">
        <div className="tablet:grid-col-6">
          <div className="card height-full">
            <div className="content-wrapper">
              <h3 className="underlined" id="primary-label">
                Petitioner Contact Info
                {caseDetailHelper.showEditContacts && (
                  <Button
                    link
                    aria-label="Edit petitioner contact information"
                    className="push-right margin-right-0 margin-top-neg-1 ustc-button--mobile-inline margin-left-2"
                    href={`/case-detail/${formattedCaseDetail.docketNumber}/contacts/primary/edit`}
                    icon="edit"
                  >
                    Edit
                  </Button>
                )}
                {caseDetailHelper.showEditPetitionerInformation && (
                  <Button
                    link
                    className="margin-left-2"
                    href={`/case-detail/${formattedCaseDetail.docketNumber}/edit-petitioner-information`}
                    icon="edit"
                  >
                    Edit
                  </Button>
                )}
              </h3>
              {formattedCaseDetail.contactPrimary && (
                <div className="grid-row">
                  <div className="grid-col-6">
                    <p className="label margin-top-0">Party type</p>
                    <p className="irs-notice-date">
                      {formattedCaseDetail.partyType}
                    </p>
                  </div>

                  <div className="grid-col-6">
                    <address aria-labelledby="primary-label">
                      <AddressDisplay
                        contact={formattedCaseDetail.contactPrimary}
                        showEmail={true}
                      />
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
                </div>
              )}
            </div>
          </div>
        </div>

        {formattedCaseDetail.contactSecondary &&
          formattedCaseDetail.contactSecondary.name && (
            <div className="tablet:grid-col-6">
              <div className="card height-full">
                <div className="content-wrapper">
                  <h3 className="underlined" id="secondary-label">
                    Spouse Contact Info
                    {caseDetailHelper.showEditContacts && (
                      <Button
                        link
                        aria-label="Edit spouse contact information"
                        className="push-right margin-right-0 margin-top-neg-1 ustc-button--mobile-inline margin-left-2"
                        href={`/case-detail/${formattedCaseDetail.docketNumber}/contacts/secondary/edit`}
                        icon="edit"
                      >
                        Edit
                      </Button>
                    )}
                  </h3>
                  <div>
                    <address aria-labelledby="secondary-label">
                      {formattedCaseDetail.contactSecondary.name && (
                        <AddressDisplay
                          contact={formattedCaseDetail.contactSecondary}
                        />
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

    const otherPetitionersInformation = () => (
      <div className="subsection party-information">
        <div className="card">
          <div className="content-wrapper">
            <div className="grid-row header-row">
              <div
                className="grid-col-6 display-flex"
                id="other-petitioners-label"
              >
                <h3>Other Petitioners</h3>
              </div>
            </div>
            <div className="grid-row grid-gap-6">
              {caseInformationHelper.formattedOtherPetitioners.map(
                (otherPetitioner, idx) => (
                  <div
                    className={classNames(
                      'grid-col-3 other-petitioners-information',
                      idx > 3 && 'margin-top-4',
                    )}
                    key={idx}
                  >
                    <address aria-labelledby="secondary-label">
                      {otherPetitioner.name && (
                        <OtherPetitionerDisplay petitioner={otherPetitioner} />
                      )}
                    </address>
                    {otherPetitioner.serviceIndicator && (
                      <div className="margin-top-4">
                        <p className="semi-bold margin-bottom-0">
                          Service preference
                        </p>
                        {otherPetitioner.serviceIndicator}
                      </div>
                    )}
                  </div>
                ),
              )}
            </div>
            <div className="grid-row">
              <div className="grid-col-12 text-right">
                <Button
                  link
                  className="margin-top-3"
                  icon={['far', 'address-card']}
                  iconSize="sm"
                  id="view-additional-petitioners-button"
                  onClick={() => {
                    toggleShowAdditionalPetitionersSequence();
                  }}
                >
                  {caseInformationHelper.toggleAdditionalPetitionersDisplay}{' '}
                  Additional Petitioners
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    const practitionerPartyInformation = () => (
      <div className="grid-container padding-x-0">
        <div className="grid-row">
          {formattedCaseDetail.privatePractitioners &&
            formattedCaseDetail.privatePractitioners.map(
              (practitioner, index) => (
                <div
                  className={classNames(
                    'tablet:grid-col-3 counsel-information',
                    index > 3 && 'margin-top-3',
                  )}
                  key={index}
                >
                  <address aria-labelledby="practitioner-label">
                    {practitioner.name && (
                      <AddressDisplay
                        contact={{
                          ...practitioner,
                          ...practitioner.contact,
                        }}
                        nameOverride={practitioner.name}
                      />
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
                  {practitioner.representingPrimary && (
                    <p>{formattedCaseDetail.contactPrimary.name}</p>
                  )}

                  {practitioner.representingSecondary &&
                    formattedCaseDetail.contactSecondary &&
                    formattedCaseDetail.contactSecondary.name && (
                      <p>{formattedCaseDetail.contactSecondary.name}</p>
                    )}

                  {practitioner.representingNames.map(name => (
                    <p key={name}>{name}</p>
                  ))}
                </div>
              ),
            )}
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
                openAddPrivatePractitionerModalSequence();
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
                    {caseInformationHelper.showEditPrivatePractitioners && (
                      <Button
                        link
                        className="margin-left-205 padding-0 height-3"
                        id="edit-privatePractitioners-button"
                        onClick={() =>
                          openEditPrivatePractitionersModalSequence()
                        }
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
        {caseInformationHelper.showOtherPetitioners &&
          otherPetitionersInformation()}
        {caseDetailHelper.showEditSecondaryContactModal && (
          <EditSecondaryContactModal />
        )}
        {showModal === 'AddPrivatePractitionerModal' && (
          <AddPrivatePractitionerModal />
        )}
        {showModal === 'EditPrivatePractitionersModal' && (
          <EditPrivatePractitionersModal />
        )}
        {showModal === 'PractitionerExistsModal' && <PractitionerExistsModal />}
      </>
    );
  },
);

export { PetitionerInformation };
