import '../../htmlGenerator/index.scss';
const React = require('react');
const { DocketHeader } = require('../components/DocketHeader.jsx');
const { PrimaryHeader } = require('../components/PrimaryHeader.jsx');

export const StandingPretrialNotice = ({ options, trialInfo }) => {
  options = {
    docketNumberWithSuffix: '101-99L',
  };
  trialInfo = {
    fullStartDate: '01/01/1991',
    judge: {
      name: 'Bob Sagot',
    },
    startTime: '10:00 am',
    state: 'Florida',
    trialLocation: 'Orlando, California',
  };
  return (
    <div className="standing-pretrial-order-small-case">
      <PrimaryHeader />
      <DocketHeader
        caseCaptionExtension={options.caseCaptionExtension}
        caseTitle={options.caseTitle}
        docketNumberWithSuffix={options.docketNumberWithSuffix}
        h3="Standing Pretrial Order for Small Tax Cases"
      />

      <p className="dashed-box">
        This case is set for trial at the {trialInfo.trialLocation} trial
        session beginning at
        <br /> <span className="text-bold">{trialInfo.startTime}</span> on{' '}
        <span className="text-bold">
          {trialInfo.fullStartDate}
          <span></span>
        </span>{' '}
        <br />
        <br />
        <b>This proceeding will be conducted remotely using Zoomgov.</b>
        <br /> (Please refer to the Notice Setting Case for Trial for log-in
        instructions.)
      </p>

      <p>
        Read this Order because it sets out the Court’s standing procedures for
        the remote trial session. If this is your first time appearing before
        the Tax Court,{' '}
        <span className="bu">
          please pay special attention to the attached “Petitioner’s
          (Taxpayer’s) Getting Ready for Trial Checklist”.
        </span>
      </p>

      <ol>
        <li>
          <span className="bu">About the Court.</span> The U.S. Tax Court hears
          disputes between taxpayers (petitioners) and the IRS (respondent). The
          Court is independent of, and not affiliated with, the IRS. Documents
          previously given to the IRS are not part of the record in this case
          and may not be considered unless made part of this case.
        </li>

        <li>
          <span className="bu">Contact Information.</span> The parties must
          provide the Court with current contact information. If your phone
          number, email, or mailing address changes, inform the Court right away
          by filing a Notice of Change of Address form, available on the Court’s
          website at <a href="/">www.ustaxcourt.gov</a>.
        </li>

        <li>
          <span className="bu">Electronic Filing (eFiling).</span> The Court
          encourages registration for DAWSON so that you can electronically file
          and view documents in your case. To register for DAWSON, call (202)
          521-4629 or email <a href="/">dawson.support@ustaxcourt.gov</a> If you
          are not registered for eFiling, you must send the opposing party a
          copy of any document you file with the Court. For more information,
          see <a href="/">www.ustaxcourt.gov</a>.
        </li>

        <li>
          <span className="bu">Communication Between the Parties</span>. The
          parties must begin discussing settlement and/or preparation of a
          stipulation of facts (facts on which the parties agree) as soon as
          possible. All minor issues should be settled so that the Judge can
          focus on the issue(s) needing a decision. Some cases may be
          susceptible to partial or full settlement, and the Court expects the
          parties to negotiate in good faith with this goal in mind. If a party
          has trouble communicating with another party or complying with this
          Order, that party should tell the Judge right away by filing a Status
          Report or requesting a conference call by calling the Judge’s chambers
          at the phone number listed below.
        </li>

        <li>
          <span className="bu">Language Barriers</span>. All Court proceedings
          are conducted in English. All documents must be filed in English or
          include a certified English translation. You should let the Judge know
          as early as possible that you require help with English. It is
          generally the responsibility of each petitioner to bring an
          interpreter. If you give advance notice, the Court may have one
          available.
        </li>

        <li>
          <span className="bu">Technology</span>. For remote proceedings, you
          must appear before the Judge as instructed in the Notice Setting Case
          for Trial. That may be by telephone or by video. Information on how to
          use Zoomgov, including tips, can be found on the Court’s website{' '}
          <a href="/">www.ustaxcourt.gov</a>. A personal Zoom account is not
          required, and there is no cost to you. If you have any concerns about
          your ability to participate in a remote Court proceeding, you should
          immediately let the Judge know
        </li>

        <li>
          <span className="bu">Readiness for Trial</span>. If the case needs a
          trial, the parties must be ready for trial when scheduled by the
          Judge. If you need special help with scheduling your trial, call the
          Judge’s chambers (at the telephone number listed below) as early as
          possible and before the first day of the trial session.
        </li>

        <ol type="a">
          <li>
            <span className="bu">Participation</span>. If you have not yet
            settled your case and you do not participate in conference calls and
            pretrial conferences, or appear at trial, the Judge may dismiss your
            case and enter a decision against you.{' '}
            <b>
              The Judge may also dismiss your case and enter a decision against
              you if you do not follow this or other Court Orders.
            </b>
          </li>

          <li>
            <span className="bu">Stipulation</span>. The parties should agree in
            writing (stipulate) before the trial begins as to all relevant facts
            and documents that they do not dispute. Examples might include tax
            returns for the years involved and the notice issued by the IRS. A
            Stipulation of Facts and the agreed documents should be filed 14
            days before the first day of trial
          </li>

          <li>
            <span className="bu">Unagreed Trial Exhibits</span>. All documents
            or materials (except impeachment documents or materials) that a
            party expects to use at trial that are not in the Stipulation of
            Facts should be filed as Proposed Trial Exhibits 14 days before the
            first day of trial.
          </li>

          <li>
            <span className="bu">Time of Trial</span>. The parties may contact
            the Judge’s chambers to request a time and date certain for the
            trial. The parties and any witnesses must be ready to participate at
            the time the trial starts. Testimony given by you or your witnesses
            during the trial is considered evidence.
          </li>

          <li>
            <span className="bu">Continuances</span>. Continuances
            (postponements of trial) will be granted only in exceptional
            circumstances. See Rule 133, Tax Court Rules of Practice and
            Procedure (available at <a href="/">www.ustaxcourt.gov</a>). Even
            joint Motions for Continuance are not automatically granted.
          </li>
        </ol>

        <li>
          <span className="bu">Pretrial Memorandum</span>. If all the issues in
          the case have not been settled, each party shall send to the Judge and
          the other party a Pretrial Memorandum. You can use the Pretrial
          Memorandum form attached to this Order. The Pretrial Memorandum must
          be filed no later than 21 days before the first day of the trial
          session.{' '}
        </li>

        <li>
          <span className="bu">
            Status Reports and Motion to Dismiss for Lack of Prosecution
          </span>
          . If the parties have (1) reached a basis of settlement or (2) will
          not need a trial for some other reason,{' '}
          <b>
            the parties must file a Status Report no later than 21 days before
            the first day of the trial session.
          </b>{' '}
          A joint Status Report from all parties is encouraged. If a party has
          not (1) responded to telephone calls from the other party, (2) has not
          cooperated in preparing the case for trial, or (3) has not agreed in
          writing to facts and documents, the other party may file a Motion to
          Dismiss for Lack of Prosecution no later than 21 days before the first
          day of the trial session.
        </li>

        <li>
          <span className="bu">Order</span>.
          <b>
            The parties are ORDERED to participate in (1) pre-trial matters,
            including conference calls and pretrial conferences scheduled by the
            Judge, and (2) trial. If you do not follow this Order, the Judge may
            dismiss your case and enter a Decision against you.
          </b>
        </li>
      </ol>

      <div className="flex">
        <div className="flex-grow-1">Dated: 01/01/2002 FIX ME</div>
        <div className="flex-grow-1 text-right">
          <p>(Signed) {trialInfo.judge.name}</p>
          (202) 521-0700
        </div>
      </div>

      <br />
      <div style={{ pageBreakAfter: 'always' }}></div>

      <PrimaryHeader />

      <h2>Petitioner’s (Taxpayer’s) Getting Ready for Trial Checklist</h2>

      <p>Before you come to Court: </p>

      <ul className="check-list">
        <li>
          <input type="checkbox" />
          Review all of the materials that the Court has sent you.
        </li>

        <li>
          <input type="checkbox" />
          Think about what facts you want to tell the Judge.
        </li>

        <li>
          <input type="checkbox" />
          Organize your facts and arguments so you can tell your side of the
          story.
        </li>

        <li>
          <input type="checkbox" />
          Organize any documents you have to support your case.
        </li>
        <li>
          <input type="checkbox" />
          Speak to the people at the IRS who call or write to you after you get
          this notice.
        </li>
        <li>
          <input type="checkbox" />
          Provide copies of documents to the IRS as soon as possible. The
          parties are required to exchange copies of any documents they want to
          use at trial, and to submit them to the Court before trial.
        </li>

        <li>
          <input type="checkbox" />
          Agree (stipulate) in writing to facts and documents that are not in
          dispute. All minor issues should be settled so that the Judge can
          focus on the remaining issue(s). The Stipulation of Facts needs to be
          filed with the Judge no later than 14 days before trial.
        </li>

        <li>
          <input type="checkbox" />
          Consider whether you need any witnesses to support your case. If you
          plan to have a witness, let the IRS know no later than 21 days before
          trial. Make sure the witness is available for trial at the trial
          session.
        </li>

        <li>
          <input type="checkbox" />
          Participate in contacts from the Judge by telephone or video.
        </li>
        <li>
          <input type="checkbox" />
          Be ready when your case is called for trial. That means you should log
          on and test your connection at least 30 minutes before your scheduled
          time.
        </li>

        <li>
          <input type="checkbox" />
          Learn more about the Tax Court at www.ustaxcourt.gov.
        </li>
      </ul>

      <br />
      <div style={{ pageBreakAfter: 'always' }}></div>

      <p style={{ marginBottom: '74px', textAlign: 'right' }}>
        Trial Calendar: {trialInfo.city} - Remote Proceedings
        <br />
        <span style={{ marginLeft: '55px' }}>
          Date: {trialInfo.fullStartDate}
        </span>
      </p>

      <p className="text-center" style={{ marginBottom: '56px' }}>
        <strong>PRETRIAL MEMORANDUM FOR</strong> (Petitioner/Respondent)
        <br />
        (Please type or print legibly. This form may be expanded as necessary.)
      </p>
      <div style={{ marginBottom: '29px' }}>
        <p style={{ float: 'left', width: '60%' }}>
          <strong className="text-underline">NAME OF CASE</strong>:
        </p>
        <p style={{ float: 'left', width: '39%' }}>
          <strong className="text-underline">DOCKET NO(S).</strong>:
        </p>
        <div className="clear"></div>
      </div>

      <p style={{ marginBottom: '10px' }}>
        <strong className="text-underline">ATTORNEYS</strong>:
      </p>
      <div style={{ marginBottom: '33px' }}>
        <p
          className="margin-top-0"
          style={{ float: 'left', marginRight: '1%', width: '49%' }}
        >
          Petitioner: ____________________________________
          <br />
          <br />
          Tel No.: ______________________________________
          <br />
          <br />
          Email: _______________________________________
        </p>
        <p className="margin-top-0" style={{ float: 'left', width: '49%' }}>
          Respondent: ____________________________________
          <br />
          <br />
          Tel No.: _______________________________________
          <br />
          <br />
          Email: _________________________________________
        </p>
        <div className="clear"></div>
      </div>

      <p style={{ marginBottom: '2px' }}>
        <strong className="text-underline">AMOUNTS IN DISPUTE</strong>:
      </p>
      <p className="margin-top-0" style={{ marginBottom: '52px' }}>
        <strong className="text-underline">Year(s)/Period(s)</strong>
        <strong className="text-underline" style={{ marginLeft: '95px' }}>
          Deficiencies/Liabilities
        </strong>
        <strong className="text-underline" style={{ marginLeft: '95px' }}>
          Additions/Penalties
        </strong>
      </p>
      <p>
        <strong className="text-underline">STATUS OF CASE</strong>:
      </p>
      <p style={{ marginBottom: '40px' }}>
        <span>Probable Settlement________</span>
        <span style={{ marginLeft: '30px' }}>Probable Trial________</span>
        <span style={{ marginLeft: '30px' }}>Definite Trial________</span>
      </p>
      <p style={{ marginBottom: '30px' }}>
        <strong className="text-underline">
          CURRENT ESTIMATE OF TRIAL TIME:
        </strong>
        __________________________________________
      </p>
      <p style={{ marginBottom: '63px' }}>
        <strong className="text-underline">MOTIONS YOUR EXPECT TO MAKE</strong>:
        <br />
        (Title and brief description)
      </p>
      <p style={{ marginBottom: '2px' }}>
        <strong className="text-underline">
          STATUS OF STIPULATION OF FACTS:
        </strong>
      </p>

      <p className="margin-top-0" style={{ marginBottom: '45px' }}>
        <span className="mr-2">
          <input className="mr-1" type="checkbox" /> Completed, will be filed
          electronically
        </span>
        <span style={{ marginLeft: '15px' }}>In Progress</span>
      </p>
      <p>
        <strong className="text-underline">ISSUES</strong>:
      </p>

      <br />
      <div style={{ pageBreakAfter: 'always' }}></div>

      <p style={{ marginBottom: '88px' }}>
        <strong className="text-underline">
          WITNESS(ES) YOU EXPECT TO CALL:
        </strong>
        <br />
        (Name and brief summary of expected testimony)
      </p>
      <p style={{ marginBottom: '97px' }}>
        <strong className="text-underline">SUMMARY OF FACTS</strong>:
        <br />
        (Attach separate pages, if necessary, to inform the Court of facts in
        chronological narrative form)
      </p>

      <p style={{ marginBottom: '91px' }}>
        <strong className="text-underline">
          BRIEF SYNOPSIS OF LEGAL AUTHORITIES:
        </strong>
        <br />
        (Attach separate pages, if necessary, to discuss fully your legal
        position)
      </p>

      <p style={{ marginBottom: '91px' }}>
        <strong className="text-underline">EVIDENTIARY PROBLEMS</strong>:
      </p>

      <div style={{ marginBottom: '61px' }}>
        <p style={{ float: 'left', width: '40%' }}>
          Date: _________________________
        </p>
        <p style={{ float: 'left', width: '59%' }}>
          ________________________________________
          <br />
          Petitioner/ Respondent
        </p>
        <div className="clear"></div>
      </div>

      <div>
        <p style={{ float: 'left', width: '15%' }}>Trial Judge:</p>

        <p style={{ float: 'left', width: '70%' }}>
          <strong>
            {trialInfo.judge.name}
            <br />
            United States Tax Court
            <br />
            400 Second Street, N.W.
            <br />
            Washington, D.C. 20217
            <br />
            (202) 521-0700
          </strong>
        </p>
        <div className="clear"></div>
      </div>
    </div>
  );
};
