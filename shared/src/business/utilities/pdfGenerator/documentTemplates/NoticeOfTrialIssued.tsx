import { FormattedTrialInfoType } from '@web-api/business/useCases/trialSessions/generateNoticeOfTrialIssuedInteractor';
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
    <div className="notice-of-trial-remote" id="notice-of-trial-pdf">
      <OrderPrimaryHeader />
      <NoticeSettingCaseForTrialDocketHeader
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
      />
      <div className="notice-info-boxes">
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
        <p className="notice-body-indent">
          The parties are hereby notified that this case is set for trial at the
          Trial Session beginning at{' '}
          <span className="text-bold">
            {trialInfo.formattedStartTime} on {trialInfo.formattedStartDate}
          </span>
          . The calendar for that Session will be called at that date and time,
          and the parties are directed to appear before the Court at a
          proceeding to be held using Zoomgov and to be prepared to try the
          case. Your failure to appear may result in dismissal of the case and
          entry of decision against you.
        </p>
        <p className="notice-body-indent">
          The Court will set the time for each trial at the end of the calendar
          call. In setting trial times the Court attempts to accommodate the
          parties, but the final determination of trial times rests in the
          Court’s discretion.
        </p>

        <div className="notice-access-remote-section">
          <p className="notice-body-indent text-underline">
            ACCESS REMOTE PROCEEDING
          </p>
          <p className="notice-body-indent notice-meeting-info">
            <span className="notice-meeting-id">
              <span className="text-bold">Meeting ID:</span>{' '}
              {trialInfo.meetingId}
            </span>
            <span className="notice-passcode">
              <span className="text-bold">Passcode:</span> {trialInfo.password}
            </span>
          </p>

          <p className="notice-body-indent">
            Join online: Go to{' '}
            <a
              href="https://www.zoomgov.com"
              rel="noreferrer"
              style={{ color: '#0050d8', textDecoration: 'underline' }}
              target="_blank"
            >
              www.zoomgov.com
            </a>{' '}
            and click &apos;Join&apos;. Enter the Meeting ID and Passcode above
            when prompted.
          </p>

          <p className="notice-body-indent">
            Join by telephone: Call {trialInfo.joinPhoneNumber}. Enter the
            Meeting ID and Passcode above when prompted.
          </p>
        </div>

        <div className="notice-remote-closing">
          <p className="notice-body-indent">
            There are specific requirements in the Standing Pretrial Order that
            is served with this Notice. The parties should contact each other
            promptly and cooperate fully so that the necessary steps can be
            taken to comply with these requirements. Your failure to cooperate
            may also result in dismissal of the case and entry of decision
            against you.
          </p>

          <div id="notice-clerk-signature">
            <ClerkOfTheCourtSignature
              nameOfClerk={nameOfClerk}
              titleOfClerk={titleOfClerk}
            />
          </div>
          <div className="clear" />
        </div>
      </div>
    </div>
  );
};
