import { FormattedTrialInfoType } from '@web-api/business/useCases/trialSessions/generateNoticeOfTrialIssuedInteractor';
import { DocumentParagraphIndent } from '../components/DocumentParagraphIndent';
import { ClerkOfTheCourtSignature } from '../components/ClerkOfTheCourtSignature';
import { NoticeSettingCaseForTrialDocketHeader } from '../components/NoticeSettingCaseForTrialDocketHeader';
import { OrderPrimaryHeader } from '../components/OrderPrimaryHeader';
import { TrialNoticeJudgeInfoBox } from '../components/TrialNoticeJudgeInfoBox';
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
  trialInfo: FormattedTrialInfoType;
}) => {
  return (
    <div id="notice-of-trial-pdf">
      <OrderPrimaryHeader />
      <NoticeSettingCaseForTrialDocketHeader
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
      />
      <div>
        <div className="info-box info-box-trial" id="trial-info">
          <div className="info-box-header">Trial At</div>
          <div className="info-box-content">
            {trialInfo.trialLocation && <div>{trialInfo.trialLocation}</div>}
            Remote Proceeding
          </div>
        </div>

        <TrialNoticeJudgeInfoBox
          chambersPhoneNumber={trialInfo.chambersPhoneNumber}
          judgeLastName={trialInfo.formattedJudge || 'Not assigned'}
        />
        <div className="clear" />
      </div>

      <div id="notice-body">
        <p>
          <DocumentParagraphIndent />
          The parties are hereby notified that this case is set for trial at the
          Trial Session beginning at {trialInfo.formattedStartTime} on{' '}
          {trialInfo.formattedStartDate}. The calendar for that Session will be
          called at that date and time, and the parties are directed to appear
          before the Court at a proceeding to be held using Zoomgov and to be
          prepared to try the case. Your failure to appear may result in
          dismissal of the case and entry of decision against you.
        </p>
        <p>
          <DocumentParagraphIndent />
          The Court will set the time for each trial at the end of the calendar
          call. In setting trial times the Court attempts to accommodate the
          parties, but the final determination of trial times rests in the
          Court’s discretion.
        </p>

        <p>
          <DocumentParagraphIndent />
          <span className="text-underline">ACCESS REMOTE PROCEEDING</span>
        </p>
        <p>
          <DocumentParagraphIndent />
          Your Meeting ID and Passcode for the remote proceeding are:
        </p>
        <p className="text-center">
          <DocumentParagraphIndent />
          <b>Meeting ID:</b> {trialInfo.meetingId}
        </p>
        <p className="text-center">
          <DocumentParagraphIndent />
          <b>Passcode:</b> {trialInfo.password}
        </p>

        <p>
          <DocumentParagraphIndent />
          Join online: Go to{' '}
          <a href="https://www.zoomgov.com" rel="noreferrer" target="_blank">
            www.zoomgov.com
          </a>{' '}
          and click &apos;Join&apos;. Enter the Meeting ID and Passcode above
          when prompted.
        </p>

        <p>
          <DocumentParagraphIndent />
          Join by telephone: Call {trialInfo.joinPhoneNumber}. Enter the Meeting
          ID and Passcode above when prompted.
        </p>

        <p>
          <DocumentParagraphIndent />
          There are specific requirements in the Standing Pretrial Order that is
          served with this Notice. The parties should contact each other
          promptly and cooperate fully so that the necessary steps can be taken
          to comply with these requirements. Your failure to cooperate may also
          result in dismissal of the case and entry of decision against you.
        </p>

        <div id="notice-clerk-signature">
          <ClerkOfTheCourtSignature
            nameOfClerk={nameOfClerk}
            titleOfClerk={titleOfClerk}
          />
        </div>
      </div>
    </div>
  );
};
