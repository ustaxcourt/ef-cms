import { Button } from '../../../ustc-ui/Button/Button';
import { DropdownMenu } from '../../../ustc-ui/DropdownMenu/DropdownMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import React from 'react';

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

export const TrialInformation = connect(
  {
    caseDetail: props.caseDetail,
    openAddEditCalendarNoteModalSequence:
      props.openAddEditCalendarNoteModalSequence,
    openAddToTrialModalSequence: props.openAddToTrialModalSequence,
    openBlockFromTrialModalSequence: props.openBlockFromTrialModalSequence,
    openPrioritizeCaseModalSequence: props.openPrioritizeCaseModalSequence,
    openRemoveFromTrialSessionModalSequence:
      props.openRemoveFromTrialSessionModalSequence,
    openUnblockFromTrialModalSequence: props.openUnblockFromTrialModalSequence,
    openUnprioritizeCaseModalSequence: props.openUnprioritizeCaseModalSequence,
    trialSessionJudge: props.trialSessionJudge,
  },
  function TrialInformation({
    caseDetail,
    openAddEditCalendarNoteModalSequence,
    openAddToTrialModalSequence,
    openBlockFromTrialModalSequence,
    openPrioritizeCaseModalSequence,
    openRemoveFromTrialSessionModalSequence,
    openUnblockFromTrialModalSequence,
    openUnprioritizeCaseModalSequence,
    trialSessionJudge,
  }) {
    return (
      <>
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
                      <td colSpan={4}>{caseDetail.highPriorityReason}</td>
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
                      <td colSpan={4}>{caseDetail.trialSessionNotes}</td>
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
                    Manually blocked from trial{' '}
                    {caseDetail.blockedDateFormatted}:{' '}
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
                      <td colSpan={4}>{caseDetail.trialSessionNotes}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </>
    );
  },
);

TrialInformation.displayName = 'TrialInformation';
