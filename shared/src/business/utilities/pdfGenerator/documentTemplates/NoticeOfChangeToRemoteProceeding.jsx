import { TRIAL_SESSION_PROCEEDING_TYPES } from '../../../entities/EntityConstants.js';

const React = require('react');
const { DocketHeader } = require('../components/DocketHeader.jsx');
const { PrimaryHeader } = require('../components/PrimaryHeader.jsx');

export const NoticeOfChangeToRemoteProceeding = ({
  caseCaptionExtension,
  caseTitle,
  docketNumberWithSuffix,
  trialInfo = {
    chambersPhoneNumber: '111111',
    formattedJudge: 'A judge',
    formattedStartDate: '3000-03-01T00:00:00.000Z',
    formattedStartTime: '',
    joinPhoneNumber: '222222',
    meetingId: '333333',
    password: '4444444',
    proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
    trialLocation: '',
  },
  //we are here
}) => {
  return (
    <div id="notice-of-change-to-remote-proceeding-pdf">
      <PrimaryHeader />
      <DocketHeader
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
      />
      <h3 className="notice-of-change-to-remote-proceeding">
        Notice of Change to Remote Proceeding
      </h3>
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
          <div className="info-box-content">{trialInfo.formattedJudge}</div>
        </div>
        <div className="clear" />
      </div>

      <div id="notice-body">
        <p>
          This case was originally calendared for an in-person proceeding at
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

        <p className="float-right width-third">
          Stephanie A. Servoss
          <br />
          Clerk of the Court
        </p>
      </div>
    </div>
  );
};
