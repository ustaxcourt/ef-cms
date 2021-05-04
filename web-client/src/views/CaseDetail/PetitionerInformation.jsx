import { AddPrivatePractitionerModal } from './AddPrivatePractitionerModal';
import { AddressDisplay } from './AddressDisplay';
import { Button } from '../../ustc-ui/Button/Button';
import { EditPrivatePractitionersModal } from './EditPrivatePractitionersModal';
import { EditSecondaryContactModal } from '../EditSecondaryContactModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { PractitionerExistsModal } from './PractitionerExistsModal';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

const PetitionerInformation = connect(
  {
    addressDisplayHelper: state.addressDisplayHelper,
    caseDetailHelper: state.caseDetailHelper,
    caseInformationHelper: state.caseInformationHelper,
    form: state.form,
    formattedCaseDetail: state.formattedCaseDetail,
    openAddPrivatePractitionerModalSequence:
      sequences.openAddPrivatePractitionerModalSequence,
    openEditPrivatePractitionersModalSequence:
      sequences.openEditPrivatePractitionersModalSequence,
    screenMetadata: state.screenMetadata,
    showModal: state.modal.showModal,
    toggleShowAdditionalPetitionersSequence:
      sequences.toggleShowAdditionalPetitionersSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state.validationErrors,
  },
  function PetitionerInformation({
    addressDisplayHelper,
    caseDetailHelper,
    caseInformationHelper,
    form,
    formattedCaseDetail,
    openAddPrivatePractitionerModalSequence,
    openEditPrivatePractitionersModalSequence,
    screenMetadata,
    showModal,
    toggleShowAdditionalPetitionersSequence,
    updateFormValueSequence,
    validationErrors,
  }) {
    const mainPartyInformation = () => (
      <div className="grid-row grid-gap-6">
        <div className="tablet:grid-col-12">
          <div className="card height-full">
            <div className="content-wrapper">
              <h3 className="underlined" id="primary-label">
                Petitioner Contact Info{' '}
                {caseInformationHelper.showAddPartyButton && (
                  <Button
                    link
                    className="margin-top-1 padding-0 float-right"
                    href={`/case-detail/${formattedCaseDetail.docketNumber}/add-petitioner-to-case`}
                    icon="plus-circle"
                  >
                    Add Petitioner
                  </Button>
                )}
              </h3>

              <div className="grid-row" id="petitioner-information">
                {caseInformationHelper.formattedPetitioners &&
                  caseInformationHelper.formattedPetitioners.map(
                    (petitioner, idx) => (
                      <div
                        className={classNames(
                          'grid-col-3 petitioner-information-card',
                          idx > 3 && 'margin-top-8',
                        )}
                        key={petitioner.name}
                      >
                        <address aria-labelledby="primary-label">
                          {petitioner.name && (
                            <AddressDisplay
                              contact={petitioner}
                              editLinkExternal={
                                petitioner.contactType !== 'otherPetitioners'
                                  ? `/case-detail/${formattedCaseDetail.docketNumber}/contacts/${petitioner.contactType}/edit`
                                  : undefined
                              }
                              editLinkInternal={`/case-detail/${formattedCaseDetail.docketNumber}/edit-petitioner-information/${petitioner.contactId}`}
                              showEmail={false}
                              showSealAddressLink={
                                caseInformationHelper.showSealAddressLink
                              }
                            />
                          )}
                        </address>
                        {addressDisplayHelper[petitioner.contactType]
                          .showSealedContact && (
                          <div className="max-width-50">
                            <p className="text-italic">
                              Call the Tax Court at (202) 521-0700 if you need
                              to update your contact information
                            </p>
                          </div>
                        )}
                        {petitioner.email && (
                          <>
                            <div className="semi-bold margin-bottom-0 margin-top-3">
                              Current email address
                            </div>
                            {petitioner.email}
                            {petitioner.showEAccessFlag && (
                              <FontAwesomeIcon
                                aria-label="has e-access"
                                className="margin-left-05 fa-icon-blue"
                                icon="flag"
                                size="1x"
                              />
                            )}
                          </>
                        )}

                        {screenMetadata.pendingEmails &&
                          screenMetadata.pendingEmails[
                            petitioner.contactId
                          ] && (
                            <>
                              <div className="semi-bold margin-top-3">
                                Pending email address
                              </div>
                              {
                                screenMetadata.pendingEmails[
                                  petitioner.contactId
                                ]
                              }
                            </>
                          )}
                        {petitioner.serviceIndicator && (
                          <div className="margin-top-4">
                            <p className="semi-bold margin-bottom-0">
                              Service preference
                            </p>
                            {petitioner.serviceIndicator}
                          </div>
                        )}
                      </div>
                    ),
                  )}
              </div>
              {formattedCaseDetail.petitioners.length > 4 && (
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
              )}
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
                  key={practitioner.name}
                >
                  <address aria-labelledby="practitioner-label">
                    {practitioner.name && (
                      <AddressDisplay
                        showEmail
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
                    <p>
                      <span>{formattedCaseDetail.contactPrimary.name}</span>
                      {formattedCaseDetail.contactPrimary.secondaryName && (
                        <span>
                          <br />
                          {formattedCaseDetail.contactPrimary.secondaryName}
                        </span>
                      )}
                      {formattedCaseDetail.contactPrimary.title && (
                        <span>
                          <br />
                          {formattedCaseDetail.contactPrimary.title}
                        </span>
                      )}
                    </p>
                  )}

                  {practitioner.representingSecondary &&
                    formattedCaseDetail.contactSecondary && (
                      <p>
                        <span>{formattedCaseDetail.contactSecondary.name}</span>
                        {formattedCaseDetail.contactSecondary.secondaryName && (
                          <span>
                            <br />
                            {formattedCaseDetail.contactSecondary.secondaryName}
                          </span>
                        )}
                        {formattedCaseDetail.contactSecondary.title && (
                          <span>
                            <br />
                            {formattedCaseDetail.contactSecondary.title}
                          </span>
                        )}
                      </p>
                    )}

                  {practitioner.representingFormatted.map(item => (
                    <p key={`representing-${item.name}`}>
                      <span>{item.name}</span>
                      {item.secondaryName && (
                        <span>
                          <br />
                          {item.secondaryName}
                        </span>
                      )}
                      {item.title && (
                        <span>
                          <br />
                          {item.title}
                        </span>
                      )}
                    </p>
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
                {caseDetailHelper.hasPrivatePractitioners &&
                  practitionerPartyInformation()}

                {!caseDetailHelper.hasPrivatePractitioners && (
                  <span>
                    There is no petitioner counsel associated with this case.
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
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
