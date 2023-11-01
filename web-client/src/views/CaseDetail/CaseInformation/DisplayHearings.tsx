import { DropdownMenu } from '../../../ustc-ui/DropdownMenu/DropdownMenu';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import React from 'react';

export const DisplayHearings = connect(
  {
    caseDetailHelper: props.caseDetailHelper,
    hearings: props.hearings,
    openAddEditHearingNoteModalSequence:
      props.openAddEditHearingNoteModalSequence,
    removeHearingSequence: props.removeHearingSequence,
  },
  function DisplayHearings({
    caseDetailHelper,
    hearings,
    openAddEditHearingNoteModalSequence,
    removeHearingSequence,
  }) {
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
            <td colSpan={4}>{hearing.calendarNotes}</td>
          </tr>
        )}
      </tbody>
    ));
  },
);

DisplayHearings.displayName = 'DisplayHearings';
