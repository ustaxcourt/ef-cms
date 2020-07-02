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
        <strong>
          The attached Notice Setting Case for Trial notifies the parties that
          this case is calendared for trial at the trial session beginning on
          {trialInfo.fullStartDate}.
        </strong>
      </p>

      <p>
        <strong className="text-underline">
          Communication Between the Parties.
        </strong>{' '}
        The parties shall begin discussing settlement and/or preparation of a
        stipulation of facts as soon as practicable. Valuation cases and
        reasonable compensation cases are generally susceptible of settlement,
        and the Court expects the parties to negotiate in good faith with this
        goal in mind. All minor issues should be settled so that the Court can
        focus on the issue(s) needing a Court decision. If a party has trouble
        communicating with another party or complying with this Order, the
        affected party should promptly advise the Court in writing, with a copy
        to each other party, or request a conference call for the parties and
        the trial Judge.
      </p>

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

      <p>
        <strong className="text-underline">Electronic Filing (eFiling)</strong>{' '}
        eFiling is required for most documents (except the petition) filed by
        parties represented by counsel in cases in which the petition is filed
        on or after July 1, 2010. Petitioners not represented by counsel may,
        but are not required to, eFile. For more information about eFiling and
        the Court&apos;s other electronic services, see{' '}
        <a href="www.ustaxcourt.gov" target="_blank">
          www.ustaxcourt.gov
        </a>
        .
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
