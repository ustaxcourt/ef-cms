const React = require('react');
const { PretrialMemorandum } = require('../components/PretrialMemorandum.jsx');
const { PrimaryHeader } = require('../components/PrimaryHeader.jsx');

export const GettingReadyForTrialChecklist = ({ trialInfo }) => {
  return (
    <div className="standing-pretrial-order-small-case">
      <PrimaryHeader />

      <h2>
        <b>
          <u>Petitioner’s (Taxpayer’s) Getting Ready for Trial Checklist</u>
        </b>
      </h2>

      <p>Before you come to Court: </p>

      <ul className="check-list">
        <li>
          <input id="materials" type="checkbox" />
          <label className="pl-1" htmlFor="materials">
            Review all of the materials that the Court has sent you.
          </label>
        </li>

        <li>
          <input id="facts" type="checkbox" />
          <label className="pl-1" htmlFor="facts">
            Think about what facts you want to tell the Judge.
          </label>
        </li>

        <li>
          <input id="facts-and-arguments" type="checkbox" />
          <label className="pl-1" htmlFor="facts-and-arguments">
            Organize your facts and arguments so you can tell your side of the
            story.
          </label>
        </li>

        <li>
          <input id="documents" type="checkbox" />
          <label className="pl-1" htmlFor="documents">
            Organize any documents you have to support your case.
          </label>
        </li>
        <li>
          <input id="contact-irs" type="checkbox" />
          <label className="pl-1" htmlFor="contact-irs">
            Speak to the people at the IRS who call or write to you after you
            get this notice.
          </label>
        </li>
        <li>
          <input id="irs-documents" type="checkbox" />
          <label className="pl-1" htmlFor="irs-documents">
            Provide copies of documents to the IRS as soon as possible. The
            parties are required to exchange copies of any documents they want
            to use at trial, and to submit them to the Court before trial.
          </label>
        </li>

        <li>
          <input id="stipulate" type="checkbox" />
          <label className="pl-1" htmlFor="stipulate">
            Agree (stipulate) in writing to facts and documents that are not in
            dispute. All minor issues should be settled so that the Judge can
            focus on the remaining issue(s). The Stipulation of Facts needs to
            be filed with the Judge no later than 14 days before trial.
          </label>
        </li>

        <li>
          <input id="witnesses" type="checkbox" />
          <label className="pl-1" htmlFor="witnesses">
            Consider whether you need any witnesses to support your case. If you
            plan to have a witness, let the IRS know no later than 21 days
            before trial. Make sure the witness is available for trial at the
            trial session.
          </label>
        </li>

        <li>
          <input id="contact-judge" type="checkbox" />
          <label className="pl-1" htmlFor="contact-judge">
            Participate in contacts from the Judge by telephone or video.
          </label>
        </li>
        <li>
          <input id="prepare-for-trial" type="checkbox" />
          <label className="pl-1" htmlFor="prepare-for-trial">
            Be ready when your case is called for trial. That means you should
            log on and test your connection at least 30 minutes before your
            scheduled time.
          </label>
        </li>

        <li>
          <input id="learn-more" type="checkbox" />
          <label className="pl-1" htmlFor="learn-more">
            Learn more about the Tax Court at{' '}
            <a href="https://www.ustaxcourt.gov">www.ustaxcourt.gov</a>.
          </label>
        </li>
      </ul>

      <br />
      <div style={{ pageBreakAfter: 'always' }}></div>

      <PretrialMemorandum trialInfo={trialInfo} />
    </div>
  );
};
