const React = require('react');
const { DocketHeader } = require('../components/DocketHeader.jsx');
const { PrimaryHeader } = require('../components/PrimaryHeader.jsx');

export const StandingPretrialNotice = ({ options, trialInfo }) => {
  return (
    <>
      <PrimaryHeader />
      <DocketHeader
        caseCaptionExtension={options.caseCaptionExtension}
        caseTitle={options.caseTitle}
        docketNumberWithSuffix={options.docketNumberWithSuffix}
        h3="Standing Pre Trial Notice"
      />

      <div className="info-box margin-bottom-0" id="trial-information">
        <div className="info-box-header text-normal text-center">
          This case is set for the trial session beginning at{' '}
          <strong>{trialInfo.startTime}</strong> on{' '}
          <strong>{trialInfo.fullStartDate}</strong>.
        </div>
        <div className="info-box-content text-center" id="trial-location">
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
        <li style={{ paddingTop: '10px' }}>
          <strong>WHAT TO DO BEFORE TRIAL</strong>
          <ul>
            <li>
              Talk to the IRS lawyer about what facts and documents you can both
              stipulate (agree) to. Facts might include your name, address, and
              the tax year(s) involved. Documents might include the notice or
              your tax returns.
            </li>
            <li>
              For documents you cannot agree on, bring 3 copies to trial. A
              photocopier may not be available at the courthouse. Only documents
              presented at trial will be part of the case record. The Tax Court
              is not part of the IRS. If you gave something to the IRS before,
              bring a copy with you!
            </li>
            <li>
              Consider filing a &quot;pretrial memorandum&quot; because it is
              helpful to the Judge. A form you can use is attached.
            </li>
            <li>
              You can send an update to the Court a week in advance if you need
              to by filing a Final Status Report, available at
              https://www.ustaxcourt.gov/FinalStatusReport/.
            </li>
            <li>
              Your case may not be tried on {trialInfo.fullStartDate} because
              trial sessions can last more than one day. If you have witnesses
              that can only be there on {trialInfo.startDay}, please put that in
              your pretrial memorandum or Final Status Report.
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
        <li style={{ paddingTop: '10px' }}>
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
    </>
  );
};
