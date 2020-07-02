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
      <div>
        <div className="info-box info-box-trial" id="trial-info">
          <div className="info-box-header">Trial At:</div>
          <div className="info-box-content">
            {trialInfo.courthouseName && <div>{trialInfo.courthouseName}</div>}
            <div>{trialInfo.address1}</div>
            {trialInfo.address2 && <div>{trialInfo.address2}</div>}
            <div>
              {trialInfo.city}, {trialInfo.state} {trialInfo.postalCode}
            </div>
          </div>
        </div>

        <div className="info-box info-box-judge" id="judge-info">
          <div className="info-box-header">Judge:</div>
          <div className="info-box-content">{trialInfo.judge}</div>
        </div>
        <div className="clear" />
      </div>
      <h3>NOTICE SETTING CASE FOR TRIAL</h3>

      <div id="notice-body">
        <p>
          This case is set for trial at the Trial Session beginning at
          {trialInfo.startTime} on {trialInfo.startDate}. The calendar for that
          Session will be called at that date and time, and the parties are
          expected to be present and to be prepared to try the case.
          <b>
            Your failure to appear may result in dismissal of the case and entry
            of decision against you.
          </b>
        </p>
        <p>
          The Court will set the time for each trial at the end of the calendar
          call. In setting trial times the Court attempts to accommodate the
          parties, but the final determination of trial times rests in the
          Court’s discretion.
        </p>
        <p>
          Information about presenting a case in the Tax Court can be found at
          <a href="www.ustaxcourt.gov" target="_blank">
            {' '}
            www.ustaxcourt.gov
          </a>
          .
        </p>

        <p>
          The parties should contact each other promptly and cooperate fully so
          that the necessary steps can be taken to comply with these
          requirements.{' '}
          <b>
            Your failure to cooperate may also result in dismissal of the case
            and entry of decision against you.
          </b>
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
