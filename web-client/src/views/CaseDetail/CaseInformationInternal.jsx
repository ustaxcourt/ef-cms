import { AddConsolidatedCaseModal } from './AddConsolidatedCaseModal';
import { Button } from '../../ustc-ui/Button/Button';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { If } from '../../ustc-ui/If/If';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import { state } from 'cerebral';
import React from 'react';

const PetitionDetails = ({ caseDetail, showPaymentRecord }) => (
  <React.Fragment>
    <div className="grid-row">
      <div className="grid-col-4">
        <p className="label">Notice/Case Type</p>
        <p>{caseDetail.caseType}</p>
      </div>
      <div className="grid-col-4">
        <p className="label">Case Procedure</p>
        <p>{caseDetail.procedureType}</p>
      </div>
      <div className="grid-col-4">
        <p className="label">Requested Place of Trial</p>
        <p>{caseDetail.formattedPreferredTrialCity}</p>
      </div>
    </div>
    <div className="grid-row">
      <div className="grid-col-4">
        <p className="label">IRS Notice Date</p>
        <p className="irs-notice-date">{caseDetail.irsNoticeDateFormatted}</p>
      </div>
      <div className="grid-col-4">
        {showPaymentRecord && (
          <React.Fragment>
            <p className="label">Petition Fee Paid</p>
            <p className="pay-gov-id-display">{caseDetail.payGovId}</p>
          </React.Fragment>
        )}
      </div>
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
          <div className="grid-col-10">{consolidatedCase.caseCaption}</div>
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
            <p className="label">Place of Trial</p>
            <p>{caseDetail.formattedPreferredTrialCity}</p>
          </div>
          <div className="grid-col-4">
            <p className="label">Trial Date</p>
            <p>{caseDetail.formattedTrialDate}</p>
          </div>
          <div className="grid-col-4">
            <p className="label">Trial Judge</p>
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
            <p className="label">Place of Trial</p>
            <p>{caseDetail.formattedTrialCity}</p>
          </div>
          <div className="grid-col-4">
            <p className="label">Trial Date</p>
            <p>{caseDetail.formattedTrialDate}</p>
          </div>
          <div className="grid-col-4">
            <p className="label">Trial Judge</p>
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
          Remove from Trial Session
        </Button>
      </>
    )}
    {caseDetail.showBlockedFromTrial && (
      <>
        <h3 className="underlined">
          Trial - Blocked From Trial
          <FontAwesomeIcon
            className="text-secondary-dark margin-left-1"
            icon={['fas', 'hand-paper']}
            size="1x"
          />
        </h3>
        <div className="grid-row">
          <p className="label">
            Blocked from Trial {caseDetail.blockedDateFormatted}:{' '}
            <span className="text-normal">{caseDetail.blockedReason}</span>
          </p>
        </div>
        <Button
          link
          className="red-warning margin-top-2"
          icon="trash"
          onClick={() => {
            openUnblockFromTrialModalSequence();
          }}
        >
          Remove Block
        </Button>
      </>
    )}
    {caseDetail.showNotScheduled && (
      <>
        <h3 className="underlined">Trial - Not Scheduled</h3>
        <div className="display-flex flex-row flex-justify">
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
          <Button
            link
            className="block-from-trial-btn red-warning"
            icon="hand-paper"
            onClick={() => {
              openBlockFromTrialModalSequence();
            }}
          >
            Block From Trial
          </Button>
        </div>
      </>
    )}
    {caseDetail.showScheduled && (
      <>
        <h3 className="underlined">Trial - Scheduled</h3>
        <div className="grid-row">
          <div className="grid-col-4">
            <p className="label">Place of Trial</p>
            <p>{caseDetail.formattedTrialCity}</p>
          </div>
          <div className="grid-col-4">
            <p className="label">Trial Date</p>
            <p>{caseDetail.formattedTrialDate}</p>
          </div>
          <div className="grid-col-4">
            <p className="label">Trial Judge</p>
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
          Remove from Trial Session
        </Button>
      </>
    )}
  </React.Fragment>
);

export const CaseInformationInternal = connect(
  {
    caseDetailHelper: state.caseDetailHelper,
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
  ({
    caseDetailHelper,
    formattedCaseDetail,
    navigateToPrintableCaseConfirmationSequence,
    openAddToTrialModalSequence,
    openBlockFromTrialModalSequence,
    openCleanModalSequence,
    openPrioritizeCaseModalSequence,
    openRemoveFromTrialSessionModalSequence,
    openUnblockFromTrialModalSequence,
    openUnprioritizeCaseModalSequence,
  }) => {
    return (
      <div className="internal-information">
        <div className="grid-container padding-x-0">
          <div className="grid-row grid-gap">
            <div className="tablet:grid-col-6">
              <div className="card height-full">
                <div className="content-wrapper">
                  <h3 className="underlined">
                    Petition Details
                    <If bind="caseDetail.irsSendDate">
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
                        Print confirmation
                      </Button>
                    </If>
                  </h3>

                  <PetitionDetails
                    caseDetail={formattedCaseDetail}
                    showPaymentRecord={caseDetailHelper.showPaymentRecord}
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
                    {formattedCaseDetail.canConsolidate && (
                      <Button
                        link
                        className="margin-right-0 margin-top-1 padding-0 float-right"
                        onClick={() => {
                          openCleanModalSequence({
                            showModal: 'AddConsolidatedCaseModal',
                          });
                        }}
                      >
                        <FontAwesomeIcon
                          className="margin-right-05"
                          icon="plus-circle"
                          size="1x"
                        />
                        Add Cases
                      </Button>
                    )}
                  </h3>
                  <AddConsolidatedCaseModal />
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
