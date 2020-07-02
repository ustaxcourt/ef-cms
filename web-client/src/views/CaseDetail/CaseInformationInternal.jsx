import { AddConsolidatedCaseModal } from './AddConsolidatedCaseModal';
import { Button } from '../../ustc-ui/Button/Button';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Hint } from '../../ustc-ui/Hint/Hint';
import { If } from '../../ustc-ui/If/If';
import { UnconsolidateCasesModal } from './UnconsolidateCasesModal';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

const PetitionDetails = ({
  caseDetail,
  caseInformationHelper,
  openCleanModalSequence,
}) => (
  <React.Fragment>
    <div className="grid-row">
      <div className="grid-col-6">
        <p className="label">Notice/case type</p>
        <p>{caseDetail.caseType}</p>
      </div>
      <div className="grid-col-6">
        <p className="label">Case procedure</p>
        <p>{caseDetail.procedureType} Tax Case</p>
      </div>
    </div>
    <div className="grid-row">
      <div className="grid-col-6">
        <p className="label">IRS notice date</p>
        <p className="irs-notice-date">{caseDetail.irsNoticeDateFormatted}</p>
      </div>
      <div className="grid-col-6">
        <p className="label">Filing fee</p>
        <p className="pay-gov-id-display margin-bottom-0">
          {caseDetail.filingFee}
        </p>
      </div>
    </div>
    <div className="grid-row">
      <div className="grid-col-6">
        <p className="label">Requested place of trial</p>
        <p className="margin-bottom-0">
          {caseDetail.formattedPreferredTrialCity}
        </p>
      </div>
      {caseInformationHelper.showSealCaseButton && (
        <div className="grid-col-6">
          <Button
            link
            className="red-warning"
            icon="lock"
            onClick={() => {
              openCleanModalSequence({
                showModal: 'SealCaseModal',
              });
            }}
          >
            Seal Case
          </Button>
        </div>
      )}
    </div>
  </React.Fragment>
);

const ConsolidatedCases = ({ caseDetail, caseDetailHelper }) => (
  <React.Fragment>
    {!caseDetailHelper.hasConsolidatedCases && <p>Not consolidated</p>}
    <div className="grid-container padding-left-0">
      {caseDetail.consolidatedCases.map((consolidatedCase, index) => (
        <div className="grid-row margin-top-3" key={index}>
          <div className="grid-col-2">
            <CaseLink formattedCase={consolidatedCase} />
          </div>
          <div className="grid-col-10">{consolidatedCase.caseTitle}</div>
        </div>
      ))}
    </div>
  </React.Fragment>
);

const TrialInformation = ({
  caseDetail,
  openAddToTrialModalSequence,
  openBlockFromTrialModalSequence,
  openPrioritizeCaseModalSequence,
  openRemoveFromTrialSessionModalSequence,
  openUnblockFromTrialModalSequence,
  openUnprioritizeCaseModalSequence,
}) => (
  <React.Fragment>
    {caseDetail.showPrioritized && (
      <>
        <h3 className="underlined">
          Trial - Not Scheduled - High Priority
          <FontAwesomeIcon
            className="margin-left-1 text-secondary-dark"
            icon={['fas', 'exclamation-circle']}
            size="1x"
          />
        </h3>
        <div className="grid-row">
          <div className="grid-col-4">
            <p className="label">Place of trial</p>
            <p>{caseDetail.formattedPreferredTrialCity}</p>
          </div>
          <div className="grid-col-4">
            <p className="label">Trial date</p>
            <p>{caseDetail.formattedTrialDate}</p>
          </div>
          <div className="grid-col-4">
            <p className="label">Trial judge</p>
            <p>{caseDetail.formattedAssociatedJudge}</p>
          </div>
        </div>
        <div className="grid-row">
          <div className="grid-col-4">
            <p className="label">Reason</p>
            <p>{caseDetail.highPriorityReason}</p>
          </div>
        </div>
        <Button
          link
          className="red-warning"
          icon="trash"
          id="remove-high-priority-btn"
          onClick={() => {
            openUnprioritizeCaseModalSequence();
          }}
        >
          Remove High Priority
        </Button>
      </>
    )}

    {caseDetail.showTrialCalendared && (
      <>
        <h3 className="underlined">
          Trial - Calendared
          <FontAwesomeIcon
            className="margin-left-1 mini-success"
            icon="check-circle"
            size="1x"
          />
        </h3>
        <div className="grid-row">
          <div className="grid-col-4">
            <p className="label">Place of trial</p>
            <p>{caseDetail.formattedTrialCity}</p>
          </div>
          <div className="grid-col-4">
            <p className="label">Trial date</p>
            <p>{caseDetail.formattedTrialDate}</p>
          </div>
          <div className="grid-col-4">
            <p className="label">Trial judge</p>
            <p>{caseDetail.formattedAssociatedJudge}</p>
          </div>
        </div>
        <Button
          link
          className="red-warning"
          icon="trash"
          id="remove-from-trial-session-btn"
          onClick={() => {
            openRemoveFromTrialSessionModalSequence();
          }}
        >
          Remove From Trial Session
        </Button>
      </>
    )}
    {caseDetail.showBlockedFromTrial && (
      <>
        <h3 className="underlined" id="blocked-from-trial-header">
          Trial - Blocked From Trial
          <FontAwesomeIcon
            className="text-secondary-dark margin-left-1"
            icon={['fas', 'hand-paper']}
            size="1x"
          />
        </h3>
        {caseDetail.blocked && (
          <div className="grid-row">
            <div className="grid-col-8">
              <p className="label">
                Manually blocked from trial {caseDetail.blockedDateFormatted}:{' '}
              </p>
              <p>{caseDetail.blockedReason}</p>
            </div>
            <div className="grid-col-4">
              <Button
                link
                className="red-warning margin-top-0 padding-0 push-right"
                icon="trash"
                onClick={() => {
                  openUnblockFromTrialModalSequence();
                }}
              >
                Remove Block
              </Button>
            </div>
          </div>
        )}
        {!caseDetail.blocked && (
          <div className="grid-row">
            <div className="grid-col-8">
              <Button
                link
                className="block-from-trial-btn red-warning margin-bottom-3"
                icon="hand-paper"
                onClick={() => {
                  openBlockFromTrialModalSequence();
                }}
              >
                Add Manual Block
              </Button>
            </div>
          </div>
        )}
        {caseDetail.automaticBlocked && (
          <div className="grid-row">
            <div className="grid-col-12">
              <p className="label">
                System blocked from trial{' '}
                {caseDetail.automaticBlockedDateFormatted}:{' '}
              </p>
              <p>{caseDetail.automaticBlockedReason}</p>
              <Hint exclamation className="margin-bottom-0 block">
                You must remove any pending item or due date to make this case
                eligible for trial
              </Hint>
            </div>
          </div>
        )}
        {caseDetail.showAutomaticBlockedAndHighPriority && (
          <div className="grid-row margin-top-3">
            <h4 className="margin-bottom-0">
              <FontAwesomeIcon
                className="text-secondary-darker"
                icon="exclamation-circle"
              />{' '}
              Trial - Not Scheduled - High Priority
            </h4>
          </div>
        )}
      </>
    )}
    {caseDetail.showNotScheduled && (
      <>
        <h3 className="underlined">Trial - Not Scheduled</h3>
        <div className="margin-bottom-1">
          <Button
            link
            icon="plus-circle"
            id="add-to-trial-session-btn"
            onClick={() => {
              openAddToTrialModalSequence();
            }}
          >
            Add to Trial
          </Button>
        </div>
        <div className="margin-bottom-1">
          <Button
            link
            className="high-priority-btn"
            icon="exclamation-circle"
            onClick={() => {
              openPrioritizeCaseModalSequence();
            }}
          >
            Mark High Priority
          </Button>
        </div>
        <div>
          <Button
            link
            className="block-from-trial-btn red-warning"
            icon="hand-paper"
            onClick={() => {
              openBlockFromTrialModalSequence();
            }}
          >
            Add Manual Block
          </Button>
        </div>
      </>
    )}
    {caseDetail.showScheduled && (
      <>
        <h3 className="underlined">Trial - Scheduled</h3>
        <div className="grid-row">
          <div className="grid-col-4">
            <p className="label">Place of trial</p>
            <p>{caseDetail.formattedTrialCity}</p>
          </div>
          <div className="grid-col-4">
            <p className="label">Trial date</p>
            <p>{caseDetail.formattedTrialDate}</p>
          </div>
          <div className="grid-col-4">
            <p className="label">Trial judge</p>
            <p>{caseDetail.formattedAssociatedJudge}</p>
          </div>
        </div>
        <Button
          link
          className="red-warning"
          icon="trash"
          id="remove-from-trial-session-btn"
          onClick={() => {
            openRemoveFromTrialSessionModalSequence();
          }}
        >
          Remove From Trial Session
        </Button>
      </>
    )}
  </React.Fragment>
);

export const CaseInformationInternal = connect(
  {
    caseDetailHelper: state.caseDetailHelper,
    caseInformationHelper: state.caseInformationHelper,
    formattedCaseDetail: state.formattedCaseDetail,
    navigateToPrintableCaseConfirmationSequence:
      sequences.navigateToPrintableCaseConfirmationSequence,
    openAddToTrialModalSequence: sequences.openAddToTrialModalSequence,
    openBlockFromTrialModalSequence: sequences.openBlockFromTrialModalSequence,
    openCleanModalSequence: sequences.openCleanModalSequence,
    openPrioritizeCaseModalSequence: sequences.openPrioritizeCaseModalSequence,
    openRemoveFromTrialSessionModalSequence:
      sequences.openRemoveFromTrialSessionModalSequence,
    openUnblockFromTrialModalSequence:
      sequences.openUnblockFromTrialModalSequence,
    openUnprioritizeCaseModalSequence:
      sequences.openUnprioritizeCaseModalSequence,
  },
  function CaseInformationInternal({
    caseDetailHelper,
    caseInformationHelper,
    formattedCaseDetail,
    navigateToPrintableCaseConfirmationSequence,
    openAddToTrialModalSequence,
    openBlockFromTrialModalSequence,
    openCleanModalSequence,
    openPrioritizeCaseModalSequence,
    openRemoveFromTrialSessionModalSequence,
    openUnblockFromTrialModalSequence,
    openUnprioritizeCaseModalSequence,
  }) {
    return (
      <div className="internal-information">
        <div className="grid-container padding-x-0">
          <div className="grid-row grid-gap">
            <div className="tablet:grid-col-6">
              <div className="card height-full">
                <div className="content-wrapper">
                  <h3 className="underlined">
                    Petition Details
                    {caseDetailHelper.showEditPetitionDetailsButton && (
                      <Button
                        link
                        className="margin-left-2 padding-0"
                        href={`/case-detail/${formattedCaseDetail.docketNumber}/edit-details`}
                        icon="edit"
                      >
                        Edit
                      </Button>
                    )}
                    <If bind="formattedCaseDetail.irsSendDate">
                      <Button
                        link
                        className="margin-right-0 margin-top-1 padding-0 float-right"
                        onClick={() => {
                          navigateToPrintableCaseConfirmationSequence({
                            docketNumber: formattedCaseDetail.docketNumber,
                          });
                        }}
                      >
                        <FontAwesomeIcon
                          className="margin-right-05"
                          icon="print"
                          size="1x"
                        />
                        Print Confirmation
                      </Button>
                    </If>
                  </h3>

                  <PetitionDetails
                    caseDetail={formattedCaseDetail}
                    caseInformationHelper={caseInformationHelper}
                    openCleanModalSequence={openCleanModalSequence}
                  />
                </div>
              </div>
            </div>
            <div className="tablet:grid-col-6">
              <div className="card height-full">
                <div className="content-wrapper">
                  <TrialInformation
                    caseDetail={formattedCaseDetail}
                    openAddToTrialModalSequence={openAddToTrialModalSequence}
                    openBlockFromTrialModalSequence={
                      openBlockFromTrialModalSequence
                    }
                    openPrioritizeCaseModalSequence={
                      openPrioritizeCaseModalSequence
                    }
                    openRemoveFromTrialSessionModalSequence={
                      openRemoveFromTrialSessionModalSequence
                    }
                    openUnblockFromTrialModalSequence={
                      openUnblockFromTrialModalSequence
                    }
                    openUnprioritizeCaseModalSequence={
                      openUnprioritizeCaseModalSequence
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="grid-row grid-gap margin-top-4">
            <div className="tablet:grid-col-6">
              <div className="card height-full">
                <div className="content-wrapper">
                  <h3 className="underlined">
                    Consolidated Cases
                    {formattedCaseDetail.canUnconsolidate && (
                      <Button
                        link
                        aria-label="unconsolidate cases"
                        className="red-warning margin-right-0 margin-top-1 padding-0 float-right"
                        icon="minus-circle"
                        onClick={() => {
                          openCleanModalSequence({
                            showModal: 'UnconsolidateCasesModal',
                          });
                        }}
                      >
                        Remove Cases
                      </Button>
                    )}
                    {formattedCaseDetail.canConsolidate && (
                      <Button
                        link
                        aria-label="add cases to consolidate with this case"
                        className="margin-right-4 margin-top-1 padding-0 float-right"
                        icon="plus-circle"
                        onClick={() => {
                          openCleanModalSequence({
                            showModal: 'AddConsolidatedCaseModal',
                          });
                        }}
                      >
                        Add Cases
                      </Button>
                    )}
                  </h3>
                  <AddConsolidatedCaseModal />
                  <UnconsolidateCasesModal />
                  {formattedCaseDetail.canConsolidate &&
                    formattedCaseDetail.consolidatedCases.length > 0 && (
                      <ConsolidatedCases
                        caseDetail={formattedCaseDetail}
                        caseDetailHelper={caseDetailHelper}
                      />
                    )}
                  {formattedCaseDetail.canConsolidate &&
                    formattedCaseDetail.consolidatedCases.length === 0 && (
                      <p>Not consolidated</p>
                    )}
                  {!formattedCaseDetail.canConsolidate && (
                    <p>This case is not eligible for consolidation.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
