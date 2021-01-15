const React = require('react');
const { DocketHeader } = require('../components/DocketHeader.jsx');
const { PrimaryHeader } = require('../components/PrimaryHeader.jsx');

export const NoticeOfTrialIssued = ({
  caseCaptionExtension,
  caseTitle,
  docketNumberWithSuffix,
  trialInfo,
}) => {
  return (
    <>
      <PrimaryHeader />
      <DocketHeader
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
      />
      <h3>Notice Setting Case For Trial</h3>
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
        <p>Your Meeting ID and Password for the remote proceeding is:</p>
        <p className="text-center">
          <b>Meeting ID:</b> {trialInfo.meetingId}
        </p>
        <p className="text-center">
          <b>Password:</b> {trialInfo.password}
        </p>

        <p>
          Join online: Go to{' '}
          <a href="https://www.zoomgov.com" rel="noreferrer" target="_blank">
            www.zoomgov.com
          </a>{' '}
          and click `Join a meeting` (blue box in the middle of the page). Enter
          the Meeting ID and Password above when prompted.
        </p>

        <p>
          Join by telephone: Call {trialInfo.joinPhoneNumber}. Enter the Meeting
          ID and Password above when prompted.
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
    </>
  );
};
