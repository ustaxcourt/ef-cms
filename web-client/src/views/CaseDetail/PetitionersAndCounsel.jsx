import { AddressDisplay } from './AddressDisplay';
import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PartiesInformationContentHeader } from './PartiesInformationContentHeader';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

const PetitionersAndCounsel = connect(
  {
    caseDetail: state.caseDetail,
    caseInformationHelper: state.caseInformationHelper,
    partiesInformationHelper: state.partiesInformationHelper,
  },
  function PetitionersAndCounsel({
    caseDetail,
    caseInformationHelper,
    partiesInformationHelper,
  }) {
    return (
      <>
        <PartiesInformationContentHeader title="Petitioner(s)" />
        <div className="grid-row grid-gap-2">
          {partiesInformationHelper.formattedPetitioners.map(petitioner => (
            <div
              className="grid-col-4 margin-bottom-4 petitioner-card"
              key={petitioner.contactId}
            >
              <div className="card height-full margin-bottom-0">
                <div className="content-wrapper parties-card">
                  <h3>
                    <div className="grid-row">
                      <div className="grid-col-9">{petitioner.name}</div>
                      <div className="grid-col-3">
                        <Button
                          link
                          className="margin-top-1 padding-0 margin-right-0 float-right edit-petitioner-button"
                          href={`/case-detail/${caseDetail.docketNumber}/edit-petitioner-information/${petitioner.contactId}`}
                          icon="edit"
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  </h3>
                  <div className="bg-primary text-white padding-1 margin-bottom-2">
                    Petitioner
                  </div>
                  <AddressDisplay
                    contact={{
                      ...petitioner,
                      name: undefined,
                    }}
                    showEmail={false}
                  />
                  <span className="address-line">
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
                  {petitioner.formattedPendingEmail}
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
                          <div className="grid-row">
                            <div className="grid-col-9">
                              {privatePractitioner.name}{' '}
                              {`(${privatePractitioner.barNumber})`}{' '}
                            </div>
                            <div className="grid-col-3">
                              {caseInformationHelper.showEditPrivatePractitioners && (
                                <Button
                                  link
                                  className="margin-left-1 padding-0"
                                  href={`/case-detail/${caseDetail.docketNumber}/edit-petitioner-counsel/${privatePractitioner.barNumber}`}
                                  icon="edit"
                                  id="edit-privatePractitioners-button"
                                  overrideMargin={true}
                                >
                                  Edit
                                </Button>
                              )}
                              {caseInformationHelper.showViewCounselButton && (
                                <Button
                                  link
                                  className="margin-left-1 padding-0"
                                  href={`/case-detail/${caseDetail.docketNumber}/edit-petitioner-counsel/${privatePractitioner.barNumber}`}
                                  icon="eye"
                                  id="view-privatePractitioners-button"
                                  overrideMargin={true}
                                >
                                  View
                                </Button>
                              )}
                            </div>
                          </div>
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
      </>
    );
  },
);

export { PetitionersAndCounsel };
