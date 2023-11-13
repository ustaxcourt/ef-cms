import { AddConsolidatedCaseModal } from '../AddConsolidatedCaseModal';
import { Button } from '../../../ustc-ui/Button/Button';
import { CaseDetails } from './CaseDetails';
import { ConsolidatedCases } from './ConsolidatedCases';
import { DisplayHearings } from './DisplayHearings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { If } from '../../../ustc-ui/If/If';
import { SetForHearingModal } from '../SetForHearingModal';
import { TrialInformation } from './TrialInformation';
import { UnconsolidateCasesModal } from '../UnconsolidateCasesModal';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const CaseInformationInternal = connect(
  {
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
              {caseInformationHelper.showEditCaseButton && (
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

CaseInformationInternal.displayName = 'CaseInformationInternal';
