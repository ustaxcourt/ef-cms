const React = require('react');
const { DocketHeader } = require('../components/DocketHeader.jsx');
const { PrimaryHeader } = require('../components/PrimaryHeader.jsx');

export const StandingPretrialOrder = ({ options, trialInfo }) => {
  return (
    <>
      <PrimaryHeader />
      <DocketHeader
        caseCaptionExtension={options.caseCaptionExtension}
        caseTitle={options.caseTitle}
        docketNumberWithSuffix={options.docketNumberWithSuffix}
        h3="Standing Pre Trial Order"
      />

      <p>
        <span className="text-bold">
          The attached Notice Setting Case for Trial notifies the parties that
          this case is calendared for trial at the remote trial session
          beginning on
          {trialInfo.fullStartDate}. This Order sets out the Court’s standing
          procedures for the remote trial session.
        </span>
      </p>

      <p>
        <span className="text-underline text-bold">About the Court.</span> The
        U.S. Tax Court hears disputes between taxpayers (petitioners) and the
        IRS (respondent). The Court is independent of, and not affiliated with,
        the IRS. Documents previously given to the IRS are not part of the
        record in this case and may not be considered unless made a part of this
        case.
      </p>

      <p>
        <span className="text-underline text-bold">Contact Information.</span>{' '}
        The parties must provide the Court with current contact information. If
        your phone number, email, or mailing address changes, inform the Court
        right away by filing a Notice of Change of Address form, available on
        the Court s website,{' '}
        <a href="https://www.ustaxcourt.gov">www.ustaxcourt.gov</a>
      </p>

      <p>
        <span className="text-underline text-bold">
          Electronic Filing (eFiling)
        </span>{' '}
        The Court encourages registration for DAWSON so that you can
        electronically file and view documents in your case. To register for
        DAWSON, call (202) 521-4629 or email{' '}
        <a href="mailto:dawson.support@ustaxcourt.gov">
          dawson.support@ustaxcourt.gov
        </a>
        . If you are not registered for eFiling, you must send the opposing
        party a copy of any document you file with the Court. eFiling will
        remain available to parties during the trial session. For more
        information, see{' '}
        <a href="https://www.ustaxcourt.gov">www.ustaxcourt.gov</a>.
      </p>

      <p>
        <span className="text-underline text-bold">
          Communication Between the Parties.
        </span>{' '}
        The parties must begin discussing settlement and/or preparation of a
        stipulation of facts (facts on which the parties agree) as soon as
        possible. All minor issues should be settled so that the Judge can focus
        on the issue(s) needing a decision. Some cases may be susceptible to
        partial or full settlement, and the Court expects the parties to
        negotiate in good faith with this goal in mind. If a party has trouble
        communicating with another party or complying with this Order, that
        party should inform the Judge right away by filing a Status Report or
        requesting a conference call by calling the Judge&apos;s chambers at the
        phone number listed below.
      </p>

      <p>
        <span className="text-underline text-bold">Language Barriers.</span> All
        Court proceedings are conducted in English. All documents must be filed
        in English or include a certified English translation. You should let
        the Judge know as early as possible that you require help with English.
        It is generally the responsibility of each petitioner to bring an
        interpreter. If you give advance notice, the Court may have one
        available.
      </p>

      <p>
        <span className="text-underline text-bold">Technology.</span> For remote
        proceedings, you must appear before the Judge as instructed in the
        Notice Setting Case for Trial. That may be by telephone or by video.
        Information on how to use Zoomgov, including tips, can be found on the
        Court&apos;s website,{' '}
        <a href="https://www.ustaxcourt.gov">www.ustaxcourt.gov</a>. A personal
        Zoom account is not required, and there is no cost to you. If you have
        any concerns about your ability to fully participate in a remote Court
        proceeding, you should immediately let the Judge know.
      </p>

      <p>
        <span className="text-underline text-bold">Sanctions.</span> The Court
        may impose appropriate sanctions, including dismissal, for any unexcused
        failure to comply with this Order. See Rule 131(b). Any failures may
        also be considered in relation to sanctions against and disciplinary
        proceedings involving counsel. See Rule 202(a).
      </p>

      <span>
        To allow the efficient disposition of all cases on the trial calendar:
      </span>

      <span>
        It is ORDERED that the parties comply with the following deadlines and
        requirements, unless the Court, upon request, grants an extension:
      </span>

      <ol>
        <li>
          <p>
            <span className="text-bold">
              No later than{' '}
              <span className="text-underline">
                60 days before the first day of the trial session
              </span>
              :{' '}
            </span>
            If a party wants to ask the Judge to decide all or part of the case
            without trial, the party may file a Motion for Summary Judgment.
          </p>
        </li>
        <li>
          <p>
            <span className="text-bold">
              No later than{' '}
              <span className="text-underline">
                45 days before the first day of the trial session
              </span>
              :{' '}
            </span>
            The parties should file any motions related to discovery or
            stipulations.
          </p>
        </li>
        <li>
          <p>
            <span className="text-bold">
              No later than{' '}
              <span className="text-underline">
                31 days before the first day of the trial session
              </span>
              :{' '}
            </span>
            The parties may file any Motions for Continuance (postponement of
            trial), which the Judge will grant only in exceptional
            circumstances. See Rule 133, Tax Court Rules of Practice and
            Procedure (available at{' '}
            <a href="https://www.ustaxcourt.gov">www.ustaxcourt.gov</a>). Even
            joint Motions for Continuance are not automatically granted.
          </p>
        </li>
        <li>
          <p>
            <span className="text-bold">
              No later than{' '}
              <span className="text-underline">
                30 days before the first day of the trial session
              </span>
              :{' '}
            </span>
            If a party plans to call an expert witness at trial, a Motion for
            Leave to File an Expert Report, with the expert report attached
            (lodged), should be filed. An expert witness’s testimony may be
            excluded if the party fails to comply with this Order and Rule
            143(g).
          </p>
        </li>
        <li>
          <p>
            <span className="text-bold">
              No later than{' '}
              <span className="text-underline">
                21 days before the first day of the trial session
              </span>
              :{' '}
            </span>
            The parties{' '}
            <span className="text-underline text-bold">shall file</span> one of
            the following: a Proposed Stipulated Decision, a Pretrial
            Memorandum, a Motion to Dismiss for Lack of Prosecution, or a Status
            Report.
          </p>
          <ol>
            <li>
              <p>
                <span className="text-underline text-bold">Settlement.</span> If
                a basis for settlement has been reached, the Proposed Stipulated
                Decision shall be electronically filed no later than 21 days
                before the first day of the trial session. If the parties have
                reached a basis for settlement and need additional time to file
                the Proposed Stipulated Decision, a joint Status Report
                including a summary of the basis of settlement shall be filed no
                later than 21 days before the first day of the trial session. A
                Stipulation of Settled Issues should be attached, if available.
                The Status Report shall state the reasons for delay in filing
                the Proposed Stipulated Decision. The Court will issue an Order
                specifying the date by which the Proposed Stipulated Decision
                will be due. If a basis for settlement is reached after the
                trial session begins, the Court will handle any required
                scheduling on the record.
              </p>
            </li>
            <li>
              <p>
                <span className="text-underline text-bold">
                  Pretrial Memoranda.{' '}
                </span>
                If a basis for settlement has not been reached and it appears
                that a trial is necessary, each party shall file a Pretrial
                Memorandum no later than 21 days before the first day of the
                trial session. A Pretrial Memorandum form is attached to this
                Order.
              </p>
            </li>
            <li>
              <p>
                <span className="text-underline text-bold"> Witnesses.</span>
                Witnesses shall be identified in the pretrial memorandum with a
                brief summary of their anticipated testimony. Witnesses who are
                not identified will not be permitted to testify at the trial
                without a showing of good cause.
              </p>
            </li>
            <li>
              <p>
                <span className="text-underline text-bold">
                  {' '}
                  Motion to Dismiss for Lack of Prosecution.
                </span>
                If a party has been unresponsive and has failed to cooperate in
                preparing the case for trial or resolution or to participate in
                preparing a Stipulation of Facts, the opposing party shall file
                a Motion to Dismiss for Lack of Prosecution no later than 21
                days before the first day of the trial session.
              </p>
            </li>
          </ol>
        </li>
        <li>
          <p>
            <span className="text-bold">
              No later than{' '}
              <span className="text-underline">
                14 days before the first day of the trial session
              </span>
              :{' '}
            </span>
            The parties{' '}
            <span className="text-underline text-bold">shall file</span> a
            Stipulation of Facts together with all stipulated documents.
            Documents and pages should be numbered for parties to identify
            documents and pages within documents easily.
          </p>
          <ol>
            <li>
              <p>
                <span className="text-underline text-bold">
                  Stipulation of Facts.
                </span>
                All facts and documents shall be stipulated (agreed upon in
                writing) to the maximum extent possible. If a complete
                stipulation of facts is not ready for submission no later than
                14 days before the first day of the trial session, or when
                otherwise ordered by the Court, and if the Court determines that
                this is due to lack of cooperation by either party, the Court
                may order sanctions against the uncooperative party.
              </p>
            </li>
            <li>
              <p>
                <span className="text-underline text-bold">
                  Unagreed Trial Exhibits.
                </span>
                All documents or materials (except impeachment documents or
                materials) that a party expects to use at trial that are not in
                the Stipulation of Facts shall be marked and filed as Proposed
                Trial Exhibits. The Court may refuse to receive in evidence any
                document or material that is not filed as a Proposed Trial
                Exhibit no later than 14 days before the first day of the trial
                session.
              </p>
            </li>
          </ol>
        </li>
        <li>
          <p>
            <span className="text-underline text-bold">
              Change in Case Status.
            </span>
            Status Report shall be filed to inform the Court if the status of
            the case changes at any time before the trial date and after a
            Pretrial Memorandum, Motion to Dismiss for Lack of Prosecution, or
            Status Report is filed. Alternatively, if the case has settled, a
            Proposed Stipulated Decision may be filed.
          </p>
        </li>
        <li>
          <p>
            <span className="text-underline text-bold">
              Remote Proceeding Access.
            </span>
            Parties shall be responsible for ensuring, to the best of their
            abilities, that they and their witnesses have adequate technology
            and internet resources to participate in a remote proceeding. The
            parties should log on and test their connections at least 30 minutes
            before the proceedings scheduled time.
          </p>
        </li>
        <li>
          <p>
            <span className="text-underline text-bold">Time of Trial.</span>
            All parties shall be prepared for trial at any time during the trial
            session unless a specific date has been previously set by the Court.
            After Pretrial Memoranda are filed, the Court may schedule a time
            and date certain for the trial. The parties may also jointly contact
            the Judge’s chambers to request a time and date certain for the
            trial. If practicable, the Court will attempt to accommodate the
            request, keeping in mind other scheduling requirements and the
            anticipated length of the session. Parties should jointly inform the
            Judge as early as possible if they expect trial to require 3 days or
            more.
          </p>
        </li>
      </ol>

      {/* the stuff below is oooooolllllddddd */}

      <p>
        <strong className="text-underline">Continuances.</strong> Continuances
        (i.e., postponement softrial) will be granted only in exceptional
        circumstances. See Rule 133, Tax Court Rules of Practice and Procedure.
        (The Court&apos;s Rules are available at{' '}
        <a href="www.ustaxcourt.gov" target="_blank">
          www.ustaxcourt.gov
        </a>
        .) Even joint motions for continuance are not granted automatically.
      </p>

      <p>
        <strong className="text-underline">Sanctions.</strong> The Court may
        impose appropriate sanctions, including dismissal, for any unexcused
        failure to comply with this Order. See Rule 131(b). Such failure may
        also be considered in relation to sanctions against and disciplinary
        proceedings involving counsel. See Rule 202(a).
      </p>

      <div style={{ marginBottom: '90px', marginLeft: '20px' }}>
        <p>
          To help the efficient disposition of all cases on the trial calendar:
        </p>

        <p>
          <strong className="text-underline">1. Stipulation.</strong>
          It is ORDERED that all facts shall be stipulated (agreed upon in
          writing) to the maximum extent possible. All documents and written
          evidence shall be marked and stipulated in accordance with Rule 91(b),
          unless the evidence is to be used only to impeach(discredit) a
          witness. Either party may preserve objections by noting them in the
          stipulation. If a complete stipulation of facts is not ready for
          submission at the start of the trial or when otherwise ordered by the
          Court, and if the Court determines that this is due to lack of
          cooperation by either party, the Court may order sanctions against the
          uncooperative party.
        </p>

        <p>
          <strong className="text-underline">2. Trial Exhibits.</strong>
          It is ORDERED that any documents or materials which a party expects to
          use (except solely for impeachment) if the case is tried, but which
          are not stipulated, shall be identified in writing and exchanged by
          the parties at least 14 days before the first day of the trial
          session. The Court may refuse to receive in evidence any document or
          material that is not so stipulated or exchanged, unless the parties
          have agreed otherwise or the Court so allows for good cause shown.
        </p>

        <p>
          <strong className="text-underline">3. Pretrial Memoranda.</strong> It
          is ORDERED that, unless a basis of settlement (resolution of the
          issues) has been reached, each party shall prepare a Pretrial
          Memorandum containing the information in the attached form. Each party
          shall serve on the other party and file the Pretrial Memorandum not
          less than 14 days before the first day of the trial session.
        </p>
        <p>
          <strong className="text-underline">4. Final Status Reports.</strong>{' '}
          It is ORDERED that, if the status of the case changes from that
          reported in a party&apos;s Pretrial Memorandum, the party shall submit
          to the undersigned and to the other party a Final Status Report
          containing the information in the attached form. A Final Status Report
          maybe submitted to the Court in paper format, electronically by
          following the procedures in the &quot;Final Status Report&quot; tab on
          the Court&apos;s Website or by fax sent to 202-521-3378. (Only the
          Final Status Report maybe sent to this fax number; any other documents
          will be discarded.) The report must be received by the Court no later
          than 3p.m. eastern time on the last business day (normally Friday)
          before the calendar call. The Final Status Report must be promptly
          submitted to the opposing party by mail, email, or fax, and a copy of
          the report must be given to the opposing party at the calendar call if
          the opposing party is present.
        </p>
        <p>
          <strong className="text-underline">5.Witnesses.</strong> It is ORDERED
          that witnessess hall be identified in the Pretrial Memorandum with a
          brief summary of their anticipated testimony. Witnesses who are not
          identified will not be permitted to testify at the trial with out a
          showing of good cause.
        </p>
        <p>
          <strong className="text-underline">6. Expert Witnesses.</strong> It is
          ORDERED that unless otherwise permitted by the Court, expert
          witnessess hall prepare a written report which shall be submitted
          directly to the undersigned and served upon each other party at least
          30 days before the first day of the trial session. An expert
          witness&apos;s test imony may be excluded for failure to comply with
          this Order and Rule 143(g).
        </p>
        <p>
          <strong className="text-underline">7. Settlements.</strong> It is
          ORDERED that if the parties have reached a basis of settlement,
          astipulated decision shall be submitted to the Court prior to or at
          the call of the calendar on the first day of the trial session.
          Additional time for submitting astipulated decision will be granted
          only where it is clear that all parties have approved the settlement.
          The parties shall be prepared to state for the record the basis of
          settlement and the reasons for delay. The Court will specify the date
          by which the stipulated decision and any related settlement documents
          will be due.
        </p>
        <p>
          <strong className="text-underline">8. Time of Trial.</strong> It is
          ORDERED that all parties shall be prepared for trial at anytime during
          the trial session unless a specific date has been previously set by
          the Court. Your case may or may not be tried on the same date as the
          calendar call, and you may need to return to Court on a later date
          during the trial session. Thus, it may be beneficial to contact the
          Court in advance. Within 2 weeks before the start of the trial
          session, the parties may jointly contact the Judge&apos;s chamber
          store quest a time and date certain for the trial. If practicable, the
          Court will attempt to accommodate the request, keeping in mind other
          scheduling requirements and the anticipated length of the session.
          Parties should jointly inform the Judge as early as possible if they
          expect trial to require 3 days or more.
        </p>
        <p>
          <strong className="text-underline">9. Service of Documents.</strong>{' '}
          It is ORDERED that every pleading, motion, letter, or other document
          (with the exception of the petition and the post trial briefs, see
          Rule 151(c)) submitted to the Court shall contain a certificate of
          service as specified in Rule21(b), which shows that the party has
          given a copy of that pleading, motion, letter or other document to all
          other parties.
        </p>
      </div>

      <div className="signature text-center">
        <p>
          (Signed) {trialInfo.judge.name}
          <br />
          Trial Judge
        </p>
      </div>
      <br />
      <div style={{ pageBreakAfter: 'always' }}></div>

      <p style={{ marginBottom: '74px', marginLeft: '393px' }}>
        Trial Calendar: {trialInfo.city}, {trialInfo.state}
        <br />
        <span style={{ marginLeft: '55px' }}>
          Date: {trialInfo.fullStartDate}
        </span>
      </p>

      <p className="text-center" style={{ marginBottom: '56px' }}>
        <strong>PRETRIAL MEMORANDUM FOR</strong> (Petitioner/Respondent)
        <br />
        Please type or print legibly
        <br />
        (This form may be expanded as necessary)
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

      <p style={{ marginBottom: '2px' }}>
        <strong className="text-underline">ATTORNEYS</strong>:
      </p>
      <div style={{ marginBottom: '33px' }}>
        <p
          className="margin-top-0"
          style={{ float: 'left', marginRight: '1%', width: '49%' }}
        >
          Petitioner: ____________________________________
          <br />
          Tel No.: ______________________________________
        </p>
        <p className="margin-top-0" style={{ float: 'left', width: '49%' }}>
          Respondent: ____________________________________
          <br />
          Tel No.: ________________________________________
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
        <span>Completed________</span>
        <span style={{ marginLeft: '15px' }}>In Process________</span>
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
    </>
  );
};
