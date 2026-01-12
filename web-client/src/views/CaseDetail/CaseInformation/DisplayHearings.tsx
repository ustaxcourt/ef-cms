import { DropdownMenu } from '../../../ustc-ui/DropdownMenu/DropdownMenu';
import { PreformattedText } from '@web-client/ustc-ui/PreformatedText/PreformattedText';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import React from 'react';
import { caseDetailHelper } from '@web-client/presenter/computeds/caseDetailHelper';

type DisplayHearingsProps = {
  hearings: any;
  caseDetailHelper: ReturnType<
    typeof caseDetailHelper
  >;
  openAddEditHearingNoteModalSequence: Function;
  removeHearingSequence: Function
}

export const DisplayHearings: React.FC<DisplayHearingsProps> = connect(
  {
    caseDetailHelper: props`caseDetailHelper`,
    hearings: props`hearings`,
    openAddEditHearingNoteModalSequence:
      props`openAddEditHearingNoteModalSequence`,
    removeHearingSequence: props`removeHearingSequence`,
  },
  function DisplayHearings({
    caseDetailHelper,
    hearings,
    openAddEditHearingNoteModalSequence,
    removeHearingSequence,
  }: {
    caseDetailHelper: {
      showAddRemoveFromHearingButtons: boolean;
      docketNumber: string;
    };
    hearings: Array<{
      trialSessionId: string;
      userIsAssignedToSession: boolean;
      formattedTrialCity: string;
      formattedTrialDate: string;
      formattedAssociatedJudge: string;
      calendarNotes?: string;
    }>;
    openAddEditHearingNoteModalSequence: (args: {
      docketNumber: string;
      note?: string;
      trialSessionId: string;
    }) => void;
    removeHearingSequence: (args: { trialSessionId: string }) => void;
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
                id={`hearing-edit-menu-${hearing.trialSessionId}`}
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
                    id: `remove-hearing-button-${hearing.trialSessionId}`,
                  },
                ]}
                menuState={`caseInformationHearingsEdit-${hearing.trialSessionId}`}
              ></DropdownMenu>
            </td>
          )}
        </tr>
        {hearing.calendarNotes && (
          <tr>
            <td colSpan={4}>
              <PreformattedText text={hearing.calendarNotes} />
            </td>
          </tr>
        )}
      </tbody>
    ));
  },
);

DisplayHearings.displayName = 'DisplayHearings';
