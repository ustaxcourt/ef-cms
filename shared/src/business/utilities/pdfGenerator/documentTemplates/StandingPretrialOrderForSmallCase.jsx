const React = require('react');
const { DocketHeader } = require('../components/DocketHeader.jsx');
const { PrimaryHeader } = require('../components/PrimaryHeader.jsx');

export const StandingPretrialOrderForSmallCase = ({ options, trialInfo }) => {
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
        <br /> <span className="text-bold">
          {trialInfo.formattedStartTime}
        </span>{' '}
        on{' '}
        <span className="text-bold">
          {trialInfo.formattedStartDateWithDayOfWeek}.<span></span>
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
          website at <a href="https://www.ustaxcourt.gov">www.ustaxcourt.gov</a>
          .
        </li>

        <li>
          <span className="bu">Electronic Filing (eFiling).</span> The Court
          encourages registration for DAWSON so that you can electronically file
          and view documents in your case. To register for DAWSON, call (202)
          521-4629 or email{' '}
          <a href="mailto:dawson.support@ustaxcourt.gov">
            dawson.support@ustaxcourt.gov
          </a>{' '}
          If you are not registered for eFiling, you must send the opposing
          party a copy of any document you file with the Court. For more
          information, see{' '}
          <a href="https://www.ustaxcourt.gov">www.ustaxcourt.gov</a>.
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
          use Zoomgov, including tips, can be found on the Court’s website,{' '}
          <a href="https://www.ustaxcourt.gov">www.ustaxcourt.gov</a>. A
          personal Zoom account is not required, and there is no cost to you. If
          you have any concerns about your ability to participate in a remote
          Court proceeding, you should immediately let the Judge know.
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
            days before the first day of trial.
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
            Procedure (available at{' '}
            <a href="https://www.ustaxcourt.gov">www.ustaxcourt.gov</a>). Even
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
          <span className="bu">Order</span>.{' '}
          <b>
            The parties are ORDERED to participate in (1) pre-trial matters,
            including conference calls and pretrial conferences scheduled by the
            Judge, and (2) trial. If you do not follow this Order, the Judge may
            dismiss your case and enter a Decision against you.
          </b>
        </li>
      </ol>
      <div className="judge-signature">
        <p style={{ float: 'left', width: '40%' }}>
          Dated: {trialInfo.formattedServedDate}
        </p>
        <p style={{ float: 'right', textAlign: 'right', width: '59%' }}>
          <b>(Signed) {trialInfo.formattedJudgeName}</b>
          <br />
          {trialInfo.chambersPhoneNumber}
        </p>
      </div>
      <br />
      <div style={{ pageBreakAfter: 'always' }}></div>
    </div>
  );
};
