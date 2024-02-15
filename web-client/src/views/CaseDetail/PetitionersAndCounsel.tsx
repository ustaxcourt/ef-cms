import { AddressDisplay } from './AddressDisplay';
import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PartiesInformationContentHeader } from './PartiesInformationContentHeader';
import { ViewPetitionerCounselModal } from './ViewPetitionerCounselModal';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const PetitionersAndCounsel = connect(
  {
    caseDetail: state.caseDetail,
    caseInformationHelper: state.caseInformationHelper,
    partiesInformationHelper: state.partiesInformationHelper,
    showModal: state.modal.showModal,
    showViewPetitionerCounselModalSequence:
      sequences.showViewPetitionerCounselModalSequence,
  },
  function PetitionersAndCounsel({
    caseDetail,
    caseInformationHelper,
    partiesInformationHelper,
    showModal,
    showViewPetitionerCounselModalSequence,
  }) {
    return (
      <>
        <PartiesInformationContentHeader title="Petitioner(s)" />
        <div className="grid-row grid-gap-2">
          {partiesInformationHelper.formattedPetitioners.map(petitioner => (
            <div
              className="tablet:grid-col-9 mobile:grid-col-9 desktop:grid-col-4 margin-bottom-4 petitioner-card"
              data-testid={`petitioner-card-${petitioner.name}`}
              key={petitioner.contactId}
            >
              <div className="card height-full margin-bottom-0">
                <div className="content-wrapper parties-card">
                  <h3 className="text-wrap">{petitioner.name}</h3>
                  <div className="bg-primary text-white padding-1 margin-bottom-2">
                    Petitioner
                    {petitioner.canEditPetitioner && (
                      <Button
                        link
                        className="width-auto white-edit-link padding-0 margin-right-0 float-right edit-petitioner-button"
                        data-testid="edit-petitioner"
                        href={petitioner.editPetitionerLink}
                        icon="edit"
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                  <AddressDisplay
                    contact={{
                      ...petitioner,
                      name: undefined,
                    }}
                    showEmail={false}
                  />
                  <span className="address-line" data-testid="petitioner-email">
                    {petitioner.formattedEmail}
                    {petitioner.showEAccessFlag && (
                      <FontAwesomeIcon
                        aria-label="has e-access"
                        className="margin-left-05 fa-icon-blue"
                        icon="flag"
                        size="1x"
                      />
                    )}
                  </span>
                  <span data-testid="petitioner-pending-email">
                    {petitioner.formattedPendingEmail}
                  </span>
                  {petitioner.showPaperPetitionEmail && (
                    <>
                      <p className="semi-bold margin-bottom-0">
                        Petition email address
                      </p>
                      <span
                        className={classNames(
                          petitioner.isAddressSealed &&
                            'margin-left-205 sealed-address',
                          'margin-top-4 word-wrap-break-word',
                        )}
                      >
                        {petitioner.isAddressSealed && (
                          <span
                            aria-label="sealed paper petition email"
                            className="sealed-contact-icon"
                          >
                            <FontAwesomeIcon
                              className="margin-right-05"
                              icon={['fas', 'lock']}
                              size="sm"
                            />
                          </span>
                        )}
                        {petitioner.formattedPaperPetitionEmail}
                      </span>
                    </>
                  )}

                  {petitioner.serviceIndicator && (
                    <span
                      className="margin-top-4"
                      data-testid="petitioner-service-indicator"
                    >
                      <p className="semi-bold margin-bottom-0">
                        Service preference
                      </p>
                      {petitioner.serviceIndicator}
                    </span>
                  )}
                  <h4 className="margin-top-3">Counsel</h4>
                  {petitioner.hasCounsel &&
                    petitioner.representingPractitioners.map(
                      privatePractitioner => (
                        <p key={privatePractitioner.userId}>
                          <span className="grid-row">
                            <span className="grid-col-9">
                              {privatePractitioner.name}{' '}
                              {`(${privatePractitioner.barNumber})`}{' '}
                            </span>
                            <span className="grid-col-3">
                              {caseInformationHelper.showEditPrivatePractitioners && (
                                <Button
                                  link
                                  className="margin-left-1 padding-0 height-3"
                                  data-testid="edit-private-practitioner-counsel"
                                  href={`/case-detail/${caseDetail.docketNumber}/edit-petitioner-counsel/${privatePractitioner.barNumber}`}
                                  icon="edit"
                                  overrideMargin={true}
                                >
                                  Edit
                                </Button>
                              )}
                              {caseInformationHelper.showViewCounselButton && (
                                <Button
                                  link
                                  className="width-auto margin-left-1 padding-0 height-3 view-privatePractitioners-button"
                                  data-testid="view-counsel-info"
                                  icon="eye"
                                  overrideMargin={true}
                                  onClick={() => {
                                    showViewPetitionerCounselModalSequence({
                                      privatePractitioner,
                                    });
                                  }}
                                >
                                  View
                                </Button>
                              )}
                            </span>
                          </span>

                          <span className="address-line">
                            {privatePractitioner.formattedEmail}
                          </span>
                          {privatePractitioner.formattedPendingEmail}
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

        {showModal === 'ViewPetitionerCounselModal' && (
          <ViewPetitionerCounselModal />
        )}
      </>
    );
  },
);

PetitionersAndCounsel.displayName = 'PetitionersAndCounsel';
