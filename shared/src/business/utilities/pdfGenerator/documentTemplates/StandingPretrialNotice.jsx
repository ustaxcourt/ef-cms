const React = require('react');

const { DocketHeader } = require('../components/DocketHeader.jsx');
const { PrimaryHeader } = require('../components/PrimaryHeader.jsx');

export const StandingPretrialNotice = ({ footerDate, options, trialInfo }) => {
  return (
    <>
      <PrimaryHeader />
      <DocketHeader
        caseCaptionExtension={options.caseCaptionExtension}
        caseTitle={options.caseTitle}
        docketNumberWithSuffix={options.docketNumberWithSuffix}
        h3="Standing Pre Trial Notice"
      />

      <div className="card" id="trial-information">
        <div className="card-header">
          This case is set for the trial session beginning at{' '}
          <strong>{trialInfo.startTime}</strong> on{' '}
          <strong>{trialInfo.fullStartDate}</strong>.
        </div>
        <div className="card-content text-center" id="trial-location">
          <div>{trialInfo.courthouseName}</div>
          <div>{trialInfo.address1}</div>
          {trialInfo.address2 && (
            <div className="address-optional">{trialInfo.address2}</div>
          )}
          {trialInfo.address3 && (
            <div className="address-optional">{trialInfo.address3}</div>
          )}
          <div>
            {trialInfo.city}, {trialInfo.state} {trialInfo.postalCode}
          </div>
        </div>
      </div>

      <ul>
        <li>
          <strong>WHAT TO DO NOW</strong>
          <ul>
            <li>
              Call respondent’s counsel (the IRS lawyer) as soon as possible.
              Their name and phone number is {trialInfo.respondentContactText}.
              <ul>
                <li>Tell them if English is not your first language.</li>
                <li>
                  Send them copies of documents that you think help your case.
                </li>
                <li>
                  Find out whether you will need to go to trial or if you can
                  settle your case.
                </li>
              </ul>
            </li>
          </ul>
        </li>
        <li>
          <strong>WHAT TO DO THE DAY OF THE TRIAL SESSION</strong>
          <ul>
            <li>
              Arrive 1 hour early because you will have to go through security.
              Bring a government-issued photo ID.
            </li>
            <li>Don’t forget copies of your documents.</li>
            <li>
              Be prepared for trial. Cases will not be continued (postponed)
              other than in unusual situations.
            </li>
          </ul>
        </li>
        <li>
          Find out more at{' '}
          <a href="http://www.ustaxcourt.gov">www.ustaxcourt.gov</a> or call
          call 202-521-0700.
        </li>
      </ul>
      <div className="signature text-center">
        <p>
          (Signed) {trialInfo.judge.name}
          <br />
          Trial Judge
        </p>
      </div>
      <h3
        className="text-center text-bold"
        id="served-stamp"
        style={{ pageBreakAfter: 'always' }}
      >
        Served {footerDate}
      </h3>
    </>
  );
};
