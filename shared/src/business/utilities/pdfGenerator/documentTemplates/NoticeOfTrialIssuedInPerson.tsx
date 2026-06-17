import { FormattedTrialInfoType } from '@web-api/business/useCases/trialSessions/generateNoticeOfTrialIssuedInteractor';
import { DocumentParagraphIndent } from '../components/DocumentParagraphIndent';
import { ClerkOfTheCourtSignature } from '../components/ClerkOfTheCourtSignature';
import { NoticeSettingCaseForTrialDocketHeader } from '../components/NoticeSettingCaseForTrialDocketHeader';
import { OrderPrimaryHeader } from '../components/OrderPrimaryHeader';
import { TrialNoticeJudgeInfoBox } from '../components/TrialNoticeJudgeInfoBox';
import React from 'react';

export const NoticeOfTrialIssuedInPerson = ({
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
            {trialInfo.courthouseName && <div>{trialInfo.courthouseName}</div>}
            <div>{trialInfo.address1}</div>
            {trialInfo.address2 && <div>{trialInfo.address2}</div>}
            <div>
              {trialInfo.city}, {trialInfo.state} {trialInfo.postalCode}
            </div>
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
          Trial Session beginning at{' '}
          <b>
            {trialInfo.formattedStartTime} on {trialInfo.formattedStartDate}
          </b>
          . The calendar for that Session will be called at that date and time,
          and the parties are expected to be present and to be prepared to try
          the case.{' '}
          <b>
            Your failure to appear may result in dismissal of the case and entry
            of decision against you.
          </b>
        </p>
        <p>
          <DocumentParagraphIndent />
          The Court will set the time for each trial at the end of the calendar
          call (unless the parties request in advance a specific date and time
          for trial and the Court grants the request). In setting trial times
          the Court attempts to accommodate the parties, but the final
          determination of trial times rests in the Court’s discretion.
        </p>
        <p>
          <DocumentParagraphIndent />
          Your attention is called to the requirements set out in the Standing
          Pretrial Order that is served with this notice.
        </p>
        <p>
          <DocumentParagraphIndent />
          <b>IMPORTANT:</b> Your case is currently set for an in-person
          proceeding. In the event that the Court is unable to hold an in-person
          proceeding and needs to proceed remotely, you will be notified and be
          given detailed instructions for accessing your remote proceeding.
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
