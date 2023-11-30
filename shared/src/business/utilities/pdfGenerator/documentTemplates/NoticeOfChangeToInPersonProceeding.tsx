import { ClerkOfTheCourtSignature } from '../components/ClerkOfTheCourtSignature';
import { DocketHeader } from '../components/DocketHeader';
import { FormattedTrialInfo } from '@shared/business/useCases/trialSessions/generateNoticeOfChangeOfTrialJudgeInteractor';
import { PrimaryHeader } from '../components/PrimaryHeader';
import React from 'react';

export const NoticeOfChangeToInPersonProceeding = ({
  caseCaptionExtension,
  caseTitle,
  docketNumberWithSuffix,
  nameOfClerk,
  titleOfClerk,
  trialInfo,
}: {
  caseCaptionExtension: string;
  caseTitle: string;
  docketNumberWithSuffix: string;
  nameOfClerk: string;
  titleOfClerk: string;
  trialInfo: FormattedTrialInfo;
}) => {
  return (
    <div id="notice-of-change-to-in-person-proceeding-pdf">
      <PrimaryHeader />
      <DocketHeader
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
        documentTitle="Notice of Change to In-Person Proceeding"
      />
      <div>
        <div className="info-box info-box-trial" id="trial-info">
          <div className="info-box-header">Trial At</div>
          <div className="info-box-content">
            {trialInfo.courthouseName && <div>{trialInfo.courthouseName}</div>}
            <div>{trialInfo.address1}</div>
            {trialInfo.address2 && <div>{trialInfo.address2}</div>}
            <div>
              {trialInfo.city}, {trialInfo.state}, {trialInfo.zip}
            </div>
            <span className="text-bold">In-Person</span>
          </div>
        </div>

        <div className="info-box info-box-judge" id="judge-info">
          <div className="info-box-header">Judge</div>
          <div className="info-box-content">
            <div> {trialInfo.formattedJudge}</div>
            <div className="label">
              Chambers Phone: {trialInfo.chambersPhoneNumber}
            </div>
          </div>
        </div>
        <div className="clear" />
      </div>

      <div id="notice-body">
        <p>
          This case was originally calendared for a remote proceeding at{' '}
          {trialInfo.trialLocation} on {trialInfo.formattedStartDate} at{' '}
          {trialInfo.formattedStartTime}. The parties are hereby notified that
          this case will be conducted in-person.{' '}
          <span className="text-bold">
            The parties are required to appear in-person at the Court location
            listed above.
          </span>
        </p>
        <p>
          The parties are hereby notified that the{' '}
          <span className="text-bold">in-person proceeding</span> will begin at{' '}
          {trialInfo.formattedStartTime} on {trialInfo.formattedStartDate}. The
          calendar will be called at that date and time, and the parties are
          directed to appear in-person before the Court and should be prepared
          to try the case.{' '}
          <span className="text-bold">
            Your failure to appear may result in dismissal of the case and entry
            of decision against you.
          </span>
        </p>

        <p className="text-italic text-bold">
          The Standing Pretrial Order served in this case remains in full force
          and effect.
        </p>

        <ClerkOfTheCourtSignature
          nameOfClerk={nameOfClerk}
          titleOfClerk={titleOfClerk}
        />
      </div>
    </div>
  );
};
