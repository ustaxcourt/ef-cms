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
    currentViewMetadata: state.currentViewMetadata,
    partiesInformationHelper: state.partiesInformationHelper,
    partyViewTabs: state.constants.PARTY_VIEW_TABS,
    showModal: state.modal.showModal,
    updatePartyViewTabSequence: sequences.updatePartyViewTabSequence,
  },
  function PartiesInformation({
    caseDetail,
    caseInformationHelper,
    currentViewMetadata,
    partiesInformationHelper,
    partyViewTabs,
    showModal,
    updatePartyViewTabSequence,
  }) {
    return (
      <>
        <div className="grid-row grid-gap">
          <div className="grid-col-3">
            <div className="border border-base-lighter">
              <div className="grid-row padding-left-205 grid-header">
                Parties & Counsel
              </div>
              <div>
                <Button
                  className={classNames(
                    'usa-button--unstyled attachment-viewer-button',
                    currentViewMetadata.caseDetail.partyViewTab ===
                      partyViewTabs.petitionersAndCounsel && 'active',
                  )}
                  onClick={() => {
                    updatePartyViewTabSequence({
                      tab: partyViewTabs.petitionersAndCounsel,
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
                      currentViewMetadata.caseDetail.partyViewTab ===
                        partyViewTabs.participantsAndCounsel && 'active',
                    )}
                    onClick={() => {
                      updatePartyViewTabSequence({
                        tab: partyViewTabs.participantsAndCounsel,
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
                    currentViewMetadata.caseDetail.partyViewTab ===
                      partyViewTabs.respondentCounsel && 'active',
                  )}
                  id="respondent-counsel"
                  onClick={() => {
                    updatePartyViewTabSequence({
                      tab: partyViewTabs.respondentCounsel,
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
            {currentViewMetadata.caseDetail.partyViewTab ===
              partyViewTabs.petitionersAndCounsel && <PetitionersAndCounsel />}
            {currentViewMetadata.caseDetail.partyViewTab ===
              partyViewTabs.participantsAndCounsel && (
              <ParticipantsAndCounsel />
            )}
            {currentViewMetadata.caseDetail.partyViewTab ===
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
