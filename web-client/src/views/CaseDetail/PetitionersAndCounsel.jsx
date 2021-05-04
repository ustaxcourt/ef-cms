import { AddressDisplay } from './AddressDisplay';
import { Button } from '../../ustc-ui/Button/Button';
import { PartiesInformationContentHeader } from './PartiesInformationContentHeader';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

const PetitionersAndCounsel = connect(
  {
    caseDetail: state.caseDetail,
    caseInformationHelper: state.caseInformationHelper,
    openEditPrivatePractitionersModalSequence:
      sequences.openEditPrivatePractitionersModalSequence,
    partiesInformationHelper: state.partiesInformationHelper,
  },
  function PetitionersAndCounsel({
    caseDetail,
    caseInformationHelper,
    openEditPrivatePractitionersModalSequence,
    partiesInformationHelper,
  }) {
    return (
      <>
        <PartiesInformationContentHeader title="Petitioner(s)" />
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
                      href={`/case-detail/${caseDetail.docketNumber}/edit-petitioner-information/${petitioner.contactId}`}
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
                            {caseInformationHelper.showEditPrivatePractitioners && (
                              <Button
                                link
                                className="margin-left-205 padding-0 height-3"
                                icon="edit"
                                id="edit-privatePractitioners-button"
                                onClick={() =>
                                  openEditPrivatePractitionersModalSequence()
                                }
                              >
                                Edit
                              </Button>
                            )}
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
      </>
    );
  },
);

export { PetitionersAndCounsel };
