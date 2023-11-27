import { ClerkOfTheCourtSignature } from '../components/ClerkOfTheCourtSignature';
import { DocketHeader } from '../components/DocketHeader';
import { PrimaryHeader } from '../components/PrimaryHeader';
import React from 'react';

export const NoticeOfChangeToRemoteProceeding = ({
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
  trialInfo: any;
}) => {
  return (
    <div id="notice-of-change-to-remote-proceeding-pdf">
      <PrimaryHeader />
      <DocketHeader
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
        documentTitle="Notice of Change to Remote Proceeding"
      />
      <div>
        <div className="info-box info-box-trial" id="trial-info">
          <div className="info-box-header">Trial At</div>
          <div className="info-box-content">
            {trialInfo.trialLocation && <div>{trialInfo.trialLocation}</div>}
            <span className="text-bold">Remote Proceeding</span>
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
          This case was originally calendared for an in-person proceeding at{' '}
          {trialInfo.trialLocation} on {trialInfo.formattedStartDate} at{' '}
          {trialInfo.formattedStartTime}. The parties are no longer required to
          appear in-person.{' '}
          <span className="text-bold">
            Instead, this proceeding will be conducted remotely.
          </span>
        </p>
        <p>
          The parties are hereby notified that the{' '}
          <span className="text-bold">remote proceeding</span> will begin at{' '}
          {trialInfo.formattedStartTime} on {trialInfo.formattedStartDate}. The
          calendar will be called at that date and time, and the parties are
          directed to appear before the Court at a remote proceeding to be held
          using Zoomgov and to be prepared to try the case. The parties shall
          follow the instructions below for how to participate in the remote
          proceeding.
        </p>

        <p className="text-underline text-bold">ACCESS REMOTE PROCEEDING</p>
        <p>Your Meeting ID and Passcode for the remote proceeding are:</p>
        <p className="text-center">
          <b>Meeting ID:</b> {trialInfo.meetingId}
        </p>
        <p className="text-center">
          <b>Passcode:</b> {trialInfo.password}
        </p>

        <p>
          <span className="text-italic text-bold">Join online</span>: Go to{' '}
          <a href="https://www.zoomgov.com" rel="noreferrer" target="_blank">
            www.zoomgov.com
          </a>{' '}
          and click `Join a meeting` (blue box in the middle of the page). Enter
          the Meeting ID and Passcode above when prompted.
        </p>

        <p>
          <span className="text-italic text-bold">Join by telephone</span>: Call{' '}
          {trialInfo.joinPhoneNumber}. Enter the Meeting ID and Passcode above
          when prompted.
        </p>

        <p className="text-underline text-bold">APPEARANCE PROCEDURE</p>

        <p>
          Only counsel of record, self-represented litigants, and witnesses may
          participate in the remote proceeding unless otherwise permitted by the
          Court.
        </p>

        <p>
          It is the responsibility of the person making a remote appearance to
          access the remote proceeding no later than ten (10) minutes prior to
          any scheduled hearing, and to check in with the Trial Participants may
          be placed on “hold” until their case is called by the Court. When
          their case is called, the parties shall state their names for the
          record.
        </p>

        <p className="text-italic text-bold">
          No recording of court proceedings may be made by any person or by any
          means.
        </p>

        <p></p>
        <p></p>

        <p className="text-underline text-bold">FAILURE TO ATTEND</p>

        <p>
          If you fail to appear the Court may dismiss your case for the failure
          to properly prosecute under Rule 149(a) of the Tax Court Rules of
          Practice and Procedure.
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
