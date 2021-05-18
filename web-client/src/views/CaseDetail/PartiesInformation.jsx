import { AddPrivatePractitionerModal } from './AddPrivatePractitionerModal';
import { Button } from '../../ustc-ui/Button/Button';
import { ParticipantsAndCounsel } from './ParticipantsAndCounsel';
import { PetitionersAndCounsel } from './PetitionersAndCounsel';
import { PractitionerExistsModal } from './PractitionerExistsModal';
import { RespondentCounsel } from './RespondentCounsel';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

const PartiesInformation = connect(
  {
    caseDetail: state.caseDetail,
    caseInformationHelper: state.caseInformationHelper,
    partiesInformationHelper: state.partiesInformationHelper,
    partyViewTabs: state.constants.PARTY_VIEW_TABS,
    screenMetadata: state.screenMetadata,
    showModal: state.modal.showModal,
    updateScreenMetadataSequence: sequences.updateScreenMetadataSequence,
  },
  function PartiesInformation({
    caseDetail,
    caseInformationHelper,
    partiesInformationHelper,
    partyViewTabs,
    screenMetadata,
    showModal,
    updateScreenMetadataSequence,
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
                    screenMetadata.partyViewTab ===
                      partyViewTabs.petitionersAndCounsel && 'active',
                  )}
                  onClick={() => {
                    updateScreenMetadataSequence({
                      key: 'partyViewTab',
                      value: partyViewTabs.petitionersAndCounsel,
                    });
                  }}
                >
                  <div
                    className="grid-row margin-left-205"
                    id="petitioners-and-counsel"
                  >
                    {partyViewTabs.petitionersAndCounsel}
                  </div>
                </Button>
                {partiesInformationHelper.showParticipantsTab && (
                  <Button
                    className={classNames(
                      'usa-button--unstyled attachment-viewer-button',
                      screenMetadata.partyViewTab ===
                        partyViewTabs.participantsAndCounsel && 'active',
                    )}
                    onClick={() => {
                      updateScreenMetadataSequence({
                        key: 'partyViewTab',
                        value: partyViewTabs.participantsAndCounsel,
                      });
                    }}
                  >
                    <div
                      className="grid-row margin-left-205"
                      id="participants-and-counsel"
                    >
                      {partyViewTabs.participantsAndCounsel}
                    </div>
                  </Button>
                )}
                <Button
                  className={classNames(
                    'usa-button--unstyled attachment-viewer-button',
                    screenMetadata.partyViewTab ===
                      partyViewTabs.respondentCounsel && 'active',
                  )}
                  id="respondent-counsel"
                  onClick={() => {
                    updateScreenMetadataSequence({
                      key: 'partyViewTab',
                      value: partyViewTabs.respondentCounsel,
                    });
                  }}
                >
                  <div className="grid-row margin-left-205">
                    {partyViewTabs.respondentCounsel}
                  </div>
                </Button>
              </div>
            </div>
            {caseInformationHelper.showAddPartyButton && (
              <Button
                className="margin-right-0 margin-top-3"
                href={`/case-detail/${caseDetail.docketNumber}/add-petitioner-to-case`}
                icon="plus-circle"
              >
                Add Party
              </Button>
            )}
          </div>
          <div className="grid-col-9">
            {screenMetadata.partyViewTab ===
              partyViewTabs.petitionersAndCounsel && <PetitionersAndCounsel />}
            {screenMetadata.partyViewTab ===
              partyViewTabs.participantsAndCounsel && (
              <ParticipantsAndCounsel />
            )}
            {screenMetadata.partyViewTab ===
              partyViewTabs.respondentCounsel && <RespondentCounsel />}
          </div>
        </div>
        {showModal === 'AddPrivatePractitionerModal' && (
          <AddPrivatePractitionerModal />
        )}
        {showModal === 'PractitionerExistsModal' && <PractitionerExistsModal />}
      </>
    );
  },
);

export { PartiesInformation };
