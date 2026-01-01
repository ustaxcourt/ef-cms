import { Button } from '../../../ustc-ui/Button/Button';
import { DropdownMenu } from '../../../ustc-ui/DropdownMenu/DropdownMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PreformattedText } from '@web-client/ustc-ui/PreformatedText/PreformattedText';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props as cerebralProps } from 'cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import { EditRemoteStatusButton } from './EditRemoteStatusButton';
import { RemoteTrialSessionInformation } from './RemoteTrialSessionInformation';
import React from 'react';

const props = cerebralProps as unknown as {
  caseDetail: {
    showTrialCalendared?: boolean;
    showBlockedFromTrial?: boolean;
    showNotScheduled?: boolean;
    showScheduled?: boolean;
    trialSessionId?: string;
    userIsAssignedToSession?: boolean;
    formattedTrialCity?: string;
    formattedTrialDate?: string;
    formattedAssociatedJudge?: string;
    trialSessionNotes?: string;
    blocked?: boolean;
    blockedDateFormatted?: string;
    blockedReason?: string;
    remoteTrialGrantedDate?: string | null;
  };
  openAddEditCalendarNoteModalSequence: (args: { note?: string }) => void;
  openAddToTrialModalSequence: () => void;
  openBlockFromTrialModalSequence: () => void;
  openRemoveFromTrialSessionModalSequence: (args: {
    trialSessionId: string;
  }) => void;
  openUnblockFromTrialModalSequence: () => void;
  trialSessionJudge: {
    name: string;
  };
};

const EditCaseTrialInformationMenu = ({
  caseDetail,
  openAddEditCalendarNoteModalSequence,
  openRemoveFromTrialSessionModalSequence,
  trialSessionId,
}: {
  caseDetail: {
    trialSessionNotes?: string;
  };
  openAddEditCalendarNoteModalSequence: (args: { note?: string }) => void;
  openRemoveFromTrialSessionModalSequence: (args: {
    trialSessionId: string;
  }) => void;
  trialSessionId: string;
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

type TrialInformationProps = {
  caseDetail: {
    showTrialCalendared?: boolean;
    showBlockedFromTrial?: boolean;
    showNotScheduled?: boolean;
    showScheduled?: boolean;
    trialSessionId?: string;
    userIsAssignedToSession?: boolean;
    formattedTrialCity?: string;
    formattedTrialDate?: string;
    formattedAssociatedJudge?: string;
    trialSessionNotes?: string;
    blocked?: boolean;
    blockedDateFormatted?: string;
    blockedReason?: string;
    remoteTrialGrantedDate?: string | null;
  };
  openAddEditCalendarNoteModalSequence: Function;
  openAddToTrialModalSequence: Function;
  openBlockFromTrialModalSequence: Function;
  openEditRemoteStatusModalSequence?: Function;
  openRemoveFromTrialSessionModalSequence: Function;
  openUnblockFromTrialModalSequence: Function;
  showEditRemoteTrialPermission?: boolean;
  trialSessionJudge: {
    name: string;
  };
}

export const TrialInformation: React.FC<TrialInformationProps> = connect(
  {
    caseDetail: props.caseDetail,
    openAddEditCalendarNoteModalSequence:
      props.openAddEditCalendarNoteModalSequence,
    openAddToTrialModalSequence: props.openAddToTrialModalSequence,
    openBlockFromTrialModalSequence: props.openBlockFromTrialModalSequence,
    openEditRemoteStatusModalSequence:
      sequences.openEditRemoteStatusModalSequence,
    openRemoveFromTrialSessionModalSequence:
      props.openRemoveFromTrialSessionModalSequence,
    openUnblockFromTrialModalSequence: props.openUnblockFromTrialModalSequence,
    showEditRemoteTrialPermission:
      state.caseInformationHelper.showEditRemoteTrialPermission,
    trialSessionJudge: props.trialSessionJudge,
  },
  function TrialInformation({
    caseDetail,
    openAddEditCalendarNoteModalSequence,
    openAddToTrialModalSequence,
    openBlockFromTrialModalSequence,
    openEditRemoteStatusModalSequence,
    openRemoveFromTrialSessionModalSequence,
    openUnblockFromTrialModalSequence,
    showEditRemoteTrialPermission,
    trialSessionJudge,
  }) {
    return (
      <>
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
                        data-testid="trial-session-location-link"
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
                      {caseDetail.trialSessionId && (
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
                      )}
                    </td>
                  </tr>
                  {caseDetail.trialSessionNotes && (
                    <tr>
                      <td colSpan={4}>
                        <PreformattedText text={caseDetail.trialSessionNotes} />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="grid-col-8">
                {!caseDetail.remoteTrialGrantedDate && (
                  <EditRemoteStatusButton
                    showEditRemoteTrialPermission={
                      showEditRemoteTrialPermission
                    }
                    openEditRemoteStatusModalSequence={
                      openEditRemoteStatusModalSequence
                    }
                  />
                )}
                <RemoteTrialSessionInformation
                  remoteTrialGrantedDate={caseDetail.remoteTrialGrantedDate}
                />
              </div>
              <div className="grid-col-4">
                {caseDetail.remoteTrialGrantedDate && (
                  <EditRemoteStatusButton
                    showEditRemoteTrialPermission={
                      showEditRemoteTrialPermission
                    }
                    openEditRemoteStatusModalSequence={
                      openEditRemoteStatusModalSequence
                    }
                  />
                )}
              </div>
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
                    data-testid="remove-block-button"
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
                    data-testid="add-manual-block-button"
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
            <div className="grid-row margin-top-2">
              <div className="grid-col-8">
                <RemoteTrialSessionInformation
                  remoteTrialGrantedDate={caseDetail.remoteTrialGrantedDate}
                />
              </div>
              <div className="grid-col-4">
                <EditRemoteStatusButton
                  showEditRemoteTrialPermission={showEditRemoteTrialPermission}
                  openEditRemoteStatusModalSequence={
                    openEditRemoteStatusModalSequence
                  }
                />
              </div>
            </div>
          </>
        )}
        {caseDetail.showNotScheduled && (
          <>
            <h3 className="underlined">Trial - Not Scheduled</h3>
            <div className="grid-row">
              <div className="grid-col-6">
                <div className="margin-bottom-1">
                  <Button
                    link
                    data-testid="add-to-trial-session-btn"
                    icon="plus-circle"
                    id="add-to-trial-session-btn"
                    onClick={() => {
                      openAddToTrialModalSequence();
                    }}
                  >
                    Add to Trial
                  </Button>
                </div>
                <div>
                  <Button
                    link
                    className="block-from-trial-btn red-warning"
                    data-testid="add-manual-block-button"
                    icon="hand-paper"
                    onClick={() => {
                      openBlockFromTrialModalSequence();
                    }}
                  >
                    Add Manual Block
                  </Button>
                </div>
                <div className="margin-top-3">
                  <EditRemoteStatusButton
                    showEditRemoteTrialPermission={
                      showEditRemoteTrialPermission
                    }
                    openEditRemoteStatusModalSequence={
                      openEditRemoteStatusModalSequence
                    }
                  />
                </div>
              </div>
              <div className="grid-col-6">
                <RemoteTrialSessionInformation
                  remoteTrialGrantedDate={caseDetail.remoteTrialGrantedDate}
                />
              </div>
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
                        trialSessionId={caseDetail.trialSessionId!}
                      />
                    </td>
                  </tr>
                  {caseDetail.trialSessionNotes && (
                    <tr>
                      <td colSpan={4}>
                        <PreformattedText text={caseDetail.trialSessionNotes} />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="grid-col-8">
                {!caseDetail.remoteTrialGrantedDate && (
                  <EditRemoteStatusButton
                    showEditRemoteTrialPermission={
                      showEditRemoteTrialPermission
                    }
                    openEditRemoteStatusModalSequence={
                      openEditRemoteStatusModalSequence
                    }
                  />
                )}
                <RemoteTrialSessionInformation
                  remoteTrialGrantedDate={caseDetail.remoteTrialGrantedDate}
                />
              </div>
              <div className="grid-col-4">
                {caseDetail.remoteTrialGrantedDate && (
                  <EditRemoteStatusButton
                    showEditRemoteTrialPermission={
                      showEditRemoteTrialPermission
                    }
                    openEditRemoteStatusModalSequence={
                      openEditRemoteStatusModalSequence
                    }
                  />
                )}
              </div>
            </div>
          </>
        )}
      </>
    );
  },
);

TrialInformation.displayName = 'TrialInformation';
