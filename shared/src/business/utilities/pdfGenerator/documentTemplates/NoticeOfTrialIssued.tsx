import { ClerkOfTheCourtSignature } from '../components/ClerkOfTheCourtSignature';
import { DocketHeader } from '../components/DocketHeader';
import { PrimaryHeader } from '../components/PrimaryHeader';
import { TrialInfoType } from '@shared/business/useCases/trialSessions/generateNoticeOfChangeToRemoteProceedingInteractor';
import React from 'react';

export const NoticeOfTrialIssued = ({
  caseCaptionExtension,
  caseTitle,
  docketNumberWithSuffix,
  nameOfClerk,
  titleOfClerk,
  trialInfo,
}: {
  nameOfClerk: string;
  titleOfClerk: string;
  caseCaptionExtension: string;
  caseTitle: string;
  docketNumberWithSuffix: string;
  trialInfo: TrialInfoType;
}) => {
  return (
    <div id="notice-of-trial-pdf">
      <PrimaryHeader />
      <DocketHeader
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
        documentTitle="Notice Setting Case For Trial"
      />
      <div>
        <div className="info-box info-box-trial" id="trial-info">
          <div className="info-box-header">Trial At</div>
          <div className="info-box-content">
            {trialInfo.trialLocation && <div>{trialInfo.trialLocation}</div>}
            Remote Proceeding
          </div>
        </div>

        <div className="info-box info-box-judge" id="judge-info">
          <div className="info-box-header">Judge</div>
          <div className="info-box-content">{trialInfo.formattedJudge}</div>
        </div>
        <div className="clear" />
      </div>

      <div id="notice-body">
        <p>
          The parties are hereby notified that this case is set for trial at the
          Trial Session beginning at {trialInfo.formattedStartTime} on{' '}
          {trialInfo.formattedStartDate}. The calendar for that Session will be
          called at that date and time, and the parties are directed to appear
          before the Court at a proceeding to be held using Zoomgov and to be
          prepared to try the case. Your failure to appear may result in
          dismissal of the case and entry of decision against you.
        </p>
        <p>
          The Court will set the time for each trial at the end of the calendar
          call. In setting trial times the Court attempts to accommodate the
          parties, but the final determination of trial times rests in the
          Court’s discretion.
        </p>

        <p className="text-underline">ACCESS REMOTE PROCEEDING</p>
        <p>Your Meeting ID and Passcode for the remote proceeding are:</p>
        <p className="text-center">
          <b>Meeting ID:</b> {trialInfo.meetingId}
        </p>
        <p className="text-center">
          <b>Passcode:</b> {trialInfo.password}
        </p>

        <p>
          Join online: Go to{' '}
          <a href="https://www.zoomgov.com" rel="noreferrer" target="_blank">
            www.zoomgov.com
          </a>{' '}
          and click `Join a meeting` (blue box in the middle of the page). Enter
          the Meeting ID and Passcode above when prompted.
        </p>

        <p>
          Join by telephone: Call {trialInfo.joinPhoneNumber}. Enter the Meeting
          ID and Passcode above when prompted.
        </p>

        <p>
          There are specific requirements in the Standing Pretrial Order that is
          served with this Notice. The parties should contact each other
          promptly and cooperate fully so that the necessary steps can be taken
          to comply with these requirements. Your failure to cooperate may also
          result in dismissal of the case and entry of decision against you.
        </p>

        <ClerkOfTheCourtSignature
          nameOfClerk={nameOfClerk}
          titleOfClerk={titleOfClerk}
        />
      </div>
    </div>
  );
};
