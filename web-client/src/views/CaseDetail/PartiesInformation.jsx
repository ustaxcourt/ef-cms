import { AddPrivatePractitionerModal } from './AddPrivatePractitionerModal';
import { AddressDisplay } from './AddressDisplay';
import { Button } from '../../ustc-ui/Button/Button';
import { EditPrivatePractitionersModal } from './EditPrivatePractitionersModal';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { PractitionerExistsModal } from './PractitionerExistsModal';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

const PartiesInformation = connect(
  {
    caseDetail: state.caseDetail,
    form: state.form,
    openAddPrivatePractitionerModalSequence:
      sequences.openAddPrivatePractitionerModalSequence,
    partiesInformationHelper: state.partiesInformationHelper,
    showModal: state.modal.showModal,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state.validationErrors,
  },
  function PartiesInformation({
    caseDetail,
    form,
    openAddPrivatePractitionerModalSequence,
    partiesInformationHelper,
    showModal,
    updateFormValueSequence,
    validationErrors,
  }) {
    return (
      <>
        <div className="grid-row grid-gap">
          <div className="grid-col-3">
            <div className="border border-base-lighter">
              <div className="grid-row padding-left-205 grid-header">
                Parties & Counsel
              </div>
              <div className="">
                <Button
                  className={classNames(
                    'usa-button--unstyled attachment-viewer-button',
                  )}
                >
                  <div className="grid-row margin-left-205">
                    Petitioner(s) & Counsel
                  </div>
                </Button>
                <Button
                  className={classNames(
                    'usa-button--unstyled attachment-viewer-button',
                  )}
                >
                  <div className="grid-row margin-left-205">
                    Intervenor/Participants & Counsel
                  </div>
                </Button>
                <Button
                  className={classNames(
                    'usa-button--unstyled attachment-viewer-button',
                  )}
                >
                  <div className="grid-row margin-left-205">
                    Respondent Counsel
                  </div>
                </Button>
              </div>
            </div>
          </div>
          <div className="grid-col-9">
            <div className="grid-row margin-bottom-2">
              <div className="grid-col-4">
                <h3>Petitioner(s)</h3>
              </div>
              <div className="grid-col-2">
                <div className="text-right">
                  <span
                    className="label margin-right-4 margin-top-05"
                    id="practitioner-counsel-search-description"
                  >
                    Add counsel
                  </span>
                </div>
              </div>
              <div className="grid-col-4">
                <FormGroup
                  className="margin-bottom-0 margin-top-0"
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
                        className="small-search-button usa-button"
                        id="search-for-practitioner"
                        type="submit"
                      >
                        <span className="usa-search__submit-text">Search</span>
                      </button>
                    </div>
                  </form>
                </FormGroup>
              </div>
              <div className="grid-col-2">
                <Button
                  link
                  className="float-right margin-right-0"
                  href={`/case-detail/${caseDetail.docketNumber}/add-petitioner-to-case`}
                  icon="plus-circle"
                >
                  Add Party
                </Button>
              </div>
            </div>

            <div className="grid-row grid-gap-2">
              {partiesInformationHelper.formattedPetitioners.map(petitioner => (
                <div
                  className="grid-col-4 margin-bottom-4"
                  key={petitioner.contactId}
                >
                  <div className="card height-full margin-bottom-0">
                    <div className="content-wrapper parties-card">
                      <h3>
                        {petitioner.name}
                        <Button
                          link
                          className="margin-top-1 padding-0 margin-right-0 float-right"
                          href={'/case-detail/'}
                          icon="edit"
                        >
                          Edit
                        </Button>
                      </h3>
                      <div className="bg-primary text-white padding-1 margin-bottom-2">
                        Petitioner
                      </div>
                      <AddressDisplay
                        contact={{
                          ...petitioner,
                          name: undefined,
                        }}
                        showEmail={true}
                        // showSealAddressLink={caseInformationHelper.showSealAddressLink}
                      />
                      {petitioner.serviceIndicator && (
                        <div className="margin-top-4">
                          <p className="semi-bold margin-bottom-0">
                            Service preference
                          </p>
                          {petitioner.serviceIndicator}
                        </div>
                      )}
                      <h4 className="margin-top-3">Counsel</h4>
                      {petitioner.hasCounsel &&
                        petitioner.representingPractitioners.map(
                          privatePractitioner => (
                            <p key={privatePractitioner.userId}>
                              <span className="address-line">
                                {privatePractitioner.name}{' '}
                                {`(${privatePractitioner.barNumber})`}{' '}
                                <Button
                                  link
                                  className="margin-top-1 padding-0 margin-left-1"
                                  href={'/case-detail/'}
                                  icon="edit"
                                >
                                  Edit
                                </Button>
                              </span>
                              <span className="address-line">
                                {privatePractitioner.email}
                              </span>
                              <span className="address-line">
                                {privatePractitioner.contact.phone}
                              </span>
                            </p>
                          ),
                        )}
                      {!petitioner.hasCounsel && 'None'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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

export { PartiesInformation };
