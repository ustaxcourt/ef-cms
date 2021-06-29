import { AddConsolidatedCaseModal } from './AddConsolidatedCaseModal';
import { Button } from '../../ustc-ui/Button/Button';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { DropdownMenu } from '../../ustc-ui/DropdownMenu/DropdownMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { If } from '../../ustc-ui/If/If';
import { SetForHearingModal } from './SetForHearingModal';
import { UnconsolidateCasesModal } from './UnconsolidateCasesModal';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

const CaseDetails = ({
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
      {caseDetail.consolidatedCases.map(consolidatedCase => (
        <div
          className="grid-row margin-top-3"
          key={consolidatedCase.docketNumber}
        >
          <div className="grid-col-2">
            <CaseLink formattedCase={consolidatedCase} />
          </div>
          <div className="grid-col-10">{consolidatedCase.caseTitle}</div>
        </div>
      ))}
    </div>
  </React.Fragment>
);

const DisplayHearings = ({
  caseDetailHelper,
  hearings,
  openAddEditHearingNoteModalSequence,
  removeHearingSequence,
}) => {
  return hearings.map(hearing => (
    <tbody className="hoverable" key={hearing.trialSessionId}>
      <tr>
        <td>
          <a
            href={
              hearing.userIsAssignedToSession
                ? `/trial-session-working-copy/${hearing.trialSessionId}`
                : `/trial-session-detail/${hearing.trialSessionId}`
            }
          >
            {hearing.formattedTrialCity}
          </a>
        </td>
        <td>{hearing.formattedTrialDate}</td>
        <td>{hearing.formattedAssociatedJudge}</td>
        {caseDetailHelper.showAddRemoveFromHearingButtons && (
          <td>
            <DropdownMenu
              menuItems={[
                {
                  click: () => {
                    openAddEditHearingNoteModalSequence({
                      docketNumber: caseDetailHelper.docketNumber,
                      note: hearing.calendarNotes,
                      trialSessionId: hearing.trialSessionId,
                    });
                  },
                  label: 'Add/Edit Hearing Note',
                },
                {
                  click: () => {
                    removeHearingSequence({
                      trialSessionId: hearing.trialSessionId,
                    });
                  },
                  label: 'Remove from Hearing',
                },
              ]}
              menuState={`caseInformationHearingsEdit-${hearing.trialSessionId}`}
            ></DropdownMenu>
          </td>
        )}
      </tr>
      {hearing.calendarNotes && (
        <tr>
          <td colSpan="4">{hearing.calendarNotes}</td>
        </tr>
      )}
    </tbody>
  ));
};

const EditCaseTrialInformationMenu = ({
  caseDetail,
  openAddEditCalendarNoteModalSequence,
  openRemoveFromTrialSessionModalSequence,
  trialSessionId,
}) => {
  return (
    <DropdownMenu
      id="edit-case-trial-information-btn"
      menuItems={[
        {
          click: () => {
            openAddEditCalendarNoteModalSequence({
              note: caseDetail.trialSessionNotes,
            });
          },
          id: 'add-edit-calendar-note',
          label: 'Add/Edit Calendar Note',
        },
        {
          click: () => {
            openRemoveFromTrialSessionModalSequence({
              trialSessionId,
            });
          },
          id: 'remove-from-trial-session-btn',
          label: 'Remove From Trial',
        },
      ]}
      menuState="caseInformationTrialEdit"
    ></DropdownMenu>
  );
};

const TrialInformation = ({
  caseDetail,
  openAddEditCalendarNoteModalSequence,
  openAddToTrialModalSequence,
  openBlockFromTrialModalSequence,
  openPrioritizeCaseModalSequence,
  openRemoveFromTrialSessionModalSequence,
  openUnblockFromTrialModalSequence,
  openUnprioritizeCaseModalSequence,
  trialSessionJudge,
}) => {
  return (
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
            <table className="usa-table ustc-table trial-list">
              <thead>
                <tr>
                  <th>Place of Trial</th>
                  <th>Trial date</th>
                  <th>Judge</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              <tbody className="hoverable">
                <tr>
                  <td>{caseDetail.formattedPreferredTrialCity}</td>
                  <td>{caseDetail.formattedTrialDate}</td>
                  <td>{caseDetail.formattedAssociatedJudge}</td>
                  <td>&nbsp;</td>
                </tr>
                {caseDetail.highPriorityReason && (
                  <tr>
                    <td colSpan="4">{caseDetail.highPriorityReason}</td>
                  </tr>
                )}
              </tbody>
            </table>
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
            <table className="usa-table ustc-table trial-list">
              <thead>
                <tr>
                  <th>Place of Trial</th>
                  <th>Trial date</th>
                  <th>Judge</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              <tbody className="hoverable">
                <tr>
                  <td>
                    <a
                      href={
                        caseDetail.userIsAssignedToSession
                          ? `/trial-session-working-copy/${caseDetail.trialSessionId}`
                          : `/trial-session-detail/${caseDetail.trialSessionId}`
                      }
                    >
                      {caseDetail.formattedTrialCity}
                    </a>
                  </td>
                  <td>{caseDetail.formattedTrialDate}</td>
                  <td>{caseDetail.formattedAssociatedJudge}</td>
                  <td>
                    <EditCaseTrialInformationMenu
                      caseDetail={caseDetail}
                      openAddEditCalendarNoteModalSequence={
                        openAddEditCalendarNoteModalSequence
                      }
                      openRemoveFromTrialSessionModalSequence={
                        openRemoveFromTrialSessionModalSequence
                      }
                      trialSessionId={caseDetail.trialSessionId}
                    />
                  </td>
                </tr>
                {caseDetail.trialSessionNotes && (
                  <tr>
                    <td colSpan="4">{caseDetail.trialSessionNotes}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
                  id="remove-block"
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
            <table className="usa-table ustc-table trial-list">
              <thead>
                <tr>
                  <th>Place of Trial</th>
                  <th>Trial date</th>
                  <th>Judge</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              <tbody className="hoverable">
                <tr>
                  <td>
                    <a
                      href={
                        caseDetail.userIsAssignedToSession
                          ? `/trial-session-working-copy/${caseDetail.trialSessionId}`
                          : `/trial-session-detail/${caseDetail.trialSessionId}`
                      }
                    >
                      {caseDetail.formattedTrialCity}
                    </a>
                  </td>
                  <td>{caseDetail.formattedTrialDate}</td>
                  <td>{trialSessionJudge.name}</td>
                  <td>
                    <EditCaseTrialInformationMenu
                      caseDetail={caseDetail}
                      openAddEditCalendarNoteModalSequence={
                        openAddEditCalendarNoteModalSequence
                      }
                      openRemoveFromTrialSessionModalSequence={
                        openRemoveFromTrialSessionModalSequence
                      }
                      trialSessionId={caseDetail.trialSessionId}
                    />
                  </td>
                </tr>
                {caseDetail.trialSessionNotes && (
                  <tr>
                    <td colSpan="4">{caseDetail.trialSessionNotes}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </React.Fragment>
  );
};

export const CaseInformationInternal = connect(
  {
    caseDetailHeaderHelper: state.caseDetailHeaderHelper,
    caseDetailHelper: state.caseDetailHelper,
    caseInformationHelper: state.caseInformationHelper,
    formattedCaseDetail: state.formattedCaseDetail,
    navigateToPrintableCaseConfirmationSequence:
      sequences.navigateToPrintableCaseConfirmationSequence,
    openAddEditCalendarNoteModalSequence:
      sequences.openAddEditCalendarNoteModalSequence,
    openAddEditHearingNoteModalSequence:
      sequences.openAddEditHearingNoteModalSequence,
    openAddToTrialModalSequence: sequences.openAddToTrialModalSequence,
    openBlockFromTrialModalSequence: sequences.openBlockFromTrialModalSequence,
    openCleanModalSequence: sequences.openCleanModalSequence,
    openPrioritizeCaseModalSequence: sequences.openPrioritizeCaseModalSequence,
    openRemoveFromTrialSessionModalSequence:
      sequences.openRemoveFromTrialSessionModalSequence,
    openSetForHearingModalSequence: sequences.openSetForHearingModalSequence,
    openUnblockFromTrialModalSequence:
      sequences.openUnblockFromTrialModalSequence,
    openUnprioritizeCaseModalSequence:
      sequences.openUnprioritizeCaseModalSequence,
    openUpdateCaseModalSequence: sequences.openUpdateCaseModalSequence,
    resetCaseMenuSequence: sequences.resetCaseMenuSequence,
    showModal: state.modal.showModal,
    trialSessionJudge: state.trialSessionJudge,
  },

  function CaseInformationInternal({
    caseDetailHeaderHelper,
    caseDetailHelper,
    caseInformationHelper,
    formattedCaseDetail,
    navigateToPrintableCaseConfirmationSequence,
    openAddEditCalendarNoteModalSequence,
    openAddEditHearingNoteModalSequence,
    openAddToTrialModalSequence,
    openBlockFromTrialModalSequence,
    openCleanModalSequence,
    openPrioritizeCaseModalSequence,
    openRemoveFromTrialSessionModalSequence,
    openSetForHearingModalSequence,
    openUnblockFromTrialModalSequence,
    openUnprioritizeCaseModalSequence,
    openUpdateCaseModalSequence,
    resetCaseMenuSequence,
    showModal,
    trialSessionJudge,
  }) {
    return (
      <div className="internal-information">
        <div className="grid-container padding-x-0">
          <div className="grid-row grid-gap">
            <div className="tablet:grid-col-12 text-right margin-bottom-2">
              {caseDetailHeaderHelper.showEditCaseButton && (
                <Button
                  link
                  className="margin-0"
                  icon="edit"
                  id="menu-edit-case-context-button"
                  onClick={() => {
                    resetCaseMenuSequence();
                    openUpdateCaseModalSequence();
                  }}
                >
                  Edit Case Status/Caption
                </Button>
              )}
            </div>
            <div className="tablet:grid-col-6">
              <div className="card height-full">
                <div className="content-wrapper">
                  <h3 className="underlined">
                    Case Details
                    {caseDetailHelper.showEditCaseDetailsButton && (
                      <Button
                        link
                        className="margin-left-2 padding-0"
                        href={`/case-detail/${formattedCaseDetail.docketNumber}/edit-details`}
                        icon="edit"
                      >
                        Edit
                      </Button>
                    )}
                    <If bind="formattedCaseDetail.showPrintConfirmationLink">
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

                  <CaseDetails
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
                    openAddEditCalendarNoteModalSequence={
                      openAddEditCalendarNoteModalSequence
                    }
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
                    trialSessionJudge={trialSessionJudge}
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
                  {formattedCaseDetail.consolidatedCases.length > 0 ? (
                    <ConsolidatedCases
                      caseDetail={formattedCaseDetail}
                      caseDetailHelper={caseDetailHelper}
                    />
                  ) : (
                    <>
                      {formattedCaseDetail.canConsolidate ? (
                        <p>Not consolidated</p>
                      ) : (
                        <p>This case is not eligible for consolidation.</p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="tablet:grid-col-6">
              <div className="card height-full">
                <div className="content-wrapper">
                  <h3 className="underlined">
                    Hearings
                    {caseDetailHelper.showAddRemoveFromHearingButtons && (
                      <Button
                        link
                        aria-label="set hearing for trial sessions"
                        className="margin-right-0 margin-top-1 padding-0 float-right"
                        icon="plus-circle"
                        onClick={() => {
                          openSetForHearingModalSequence();
                        }}
                      >
                        Set for Hearing
                      </Button>
                    )}
                    {showModal === 'SetForHearingModal' && (
                      <SetForHearingModal />
                    )}
                  </h3>
                  {caseInformationHelper.showHearingsTable && (
                    <table className="usa-table ustc-table trial-list">
                      <thead>
                        <tr>
                          <th>Place of Trial</th>
                          <th>Trial date</th>
                          <th>Judge</th>
                          <th>&nbsp;</th>
                        </tr>
                      </thead>
                      <DisplayHearings
                        caseDetailHelper={caseDetailHelper}
                        hearings={formattedCaseDetail.hearings}
                        openAddEditHearingNoteModalSequence={
                          openAddEditHearingNoteModalSequence
                        }
                        removeHearingSequence={
                          openRemoveFromTrialSessionModalSequence
                        }
                      />
                    </table>
                  )}
                  {!caseInformationHelper.showHearingsTable && (
                    <p>There are no hearings set for this case.</p>
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
