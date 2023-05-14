import { OrderDocketHeader } from '../components/OrderDocketHeader';
import { OrderPrimaryHeader } from '../components/OrderPrimaryHeader';
import React from 'react';

export const StandingPretrialOrder = ({ options, trialInfo }) => {
  return (
    <div id="standing-pretrial-order">
      <div className="standing-pretrial-order-regular-case">
        <OrderPrimaryHeader />
        <OrderDocketHeader
          caseCaptionExtension={options.caseCaptionExtension}
          caseTitle={options.caseTitle.toUpperCase()}
          docketNumberWithSuffix={options.docketNumberWithSuffix}
        />

        <div
          className="text-center standing-pretrial-card"
          id="trial-information-card"
        >
          <p>
            This case is set for trial at the {trialInfo.trialLocation} trial
            session beginning at <br />
            <span className="text-bold">
              {trialInfo.formattedStartTime}
            </span> on{' '}
            <span className="text-bold">
              {trialInfo.formattedStartDateWithDayOfWeek}
            </span>
            .
          </p>
          <p>
            Please refer to the Notice Setting Case for Trial for more
            information.
          </p>
        </div>

        <h3 className="text-center text-underline text-bold margin-top-0">
          Standing Pretrial Order
        </h3>

        <p className="text-bold">
          This Order sets out the Court’s standing procedures for the trial
          session. If this is your first time appearing before the U.S. Tax
          Court, please pay special attention to the attached
          &quot;Petitioner&apos;s (Taxpayer&apos;s) Getting Ready for Trial
          Checklist.&quot;
        </p>
        <p>
          <span className="text-underline text-bold">About the Court</span>. The
          U.S. Tax Court hears disputes between taxpayers (petitioners) and the
          IRS (respondent). The Court is independent of, and not affiliated
          with, the IRS. Documents previously given to the IRS are not part of
          the record in this case and may not be considered unless made a part
          of this case.
        </p>

        <p>
          <span className="text-underline text-bold">Contact Information</span>.
          The parties must provide the Court with current contact information.
          If your phone number, email, or mailing address changes, inform the
          Court right away by filing a Notice of Change of Address form,
          available on the Court&apos;s website,{' '}
          <a href="https://www.ustaxcourt.gov">www.ustaxcourt.gov</a>.
        </p>

        <p>
          <span className="text-underline text-bold">
            Electronic Filing (eFiling)
          </span>
          . The Court encourages registration for DAWSON, the Court’s electronic
          filing and case management system, so that you can electronically file
          and view documents in your case. If you are not registered for
          eFiling, you must send the opposing party a copy of any document you
          file with the Court. To register for DAWSON, email{' '}
          <a href="mailto:dawson.support@ustaxcourt.gov">
            dawson.support@ustaxcourt.gov
          </a>
          . eFiling will remain available to parties during the trial session.
          For more information, see{' '}
          <a href="https://www.ustaxcourt.gov">www.ustaxcourt.gov</a>.
        </p>

        <p>
          <span className="text-underline text-bold">
            Communication Between the Parties
          </span>
          . The parties must begin discussing settlement and/or preparation of a
          stipulation of facts (facts on which the parties agree) as soon as
          possible. All minor issues should be settled so that the Judge can
          focus on the issue(s) needing a decision. Some cases may be
          susceptible to partial or full settlement, and the Court expects the
          parties to negotiate in good faith with this goal in mind. If a party
          has trouble communicating with another party or complying with this
          Order, that party should inform the Judge right away by filing a
          Status Report or requesting a conference call by calling the
          Judge&apos;s chambers at the phone number listed below.
        </p>

        <p>
          <span className="text-underline text-bold">Language Barriers</span>.
          All Court proceedings are conducted in English. All documents must be
          filed in English or include a certified English translation. You
          should let the Judge know as early as possible if you require help
          with English. It is generally the responsibility of each petitioner to
          bring an interpreter. If you give advance notice, the Court may have
          one available.
        </p>

        <p>
          <span className="text-underline text-bold">Sanctions</span>. The Court
          may impose appropriate sanctions, including dismissal, for any
          unexcused failure to comply with this or other Court orders. See Rule
          131(b), Tax Court Rules of Practice and Procedure (available at{' '}
          <a href="https://www.ustaxcourt.gov">www.ustaxcourt.gov</a>).{' '}
          <span className="text-bold">
            If you have not settled your case and you do not participate in
            conference calls and pretrial conferences, or appear at trial, the
            Judge may dismiss your case and enter a decision against you.{' '}
          </span>{' '}
          Any failures may also be considered in relation to sanctions against
          and disciplinary proceedings involving counsel. See Rule 202(a).
        </p>

        <p>
          <span>
            To allow the efficient disposition of all cases on the trial
            calendar:
          </span>
        </p>

        <p>
          <span>
            It is ORDERED that the parties comply with the following deadlines
            and requirements, unless the Court, upon request, grants an
            extension:
          </span>
        </p>

        <ol className="text-bold inline-ol">
          <li>
            <p>
              <span className="text-bold">
                No later than{' '}
                <span className="text-underline">
                  60 days before the first day of the trial session
                </span>
                :{' '}
              </span>
              <span className="text-normal">
                If a party wants to ask the Judge to decide all or part of the
                case without trial, the party may file a Motion for Summary
                Judgment.
              </span>
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
              <span className="text-normal">
                The parties should file any motions related to discovery or
                stipulations.
              </span>
            </p>
          </li>
          <li>
            <div>
              <span className="text-bold">
                No later than{' '}
                <span className="text-underline">
                  31 days before the first day of the trial session
                </span>
                :{' '}
              </span>
              <ol className="text-bold" type="A">
                <li>
                  <p>
                    <span className="text-underline text-bold">
                      {' '}
                      Motion for Continuance
                    </span>
                    <span className="text-normal">
                      . The parties may file any Motions for Continuance
                      (postponement of trial), which the Judge will grant only
                      in exceptional circumstances. See Rule 133. Even joint
                      Motions for Continuance are not automatically granted.
                    </span>
                  </p>
                </li>
                <li>
                  <p>
                    <span className="text-underline text-bold">
                      {' '}
                      Motion to Proceed Remotely
                    </span>
                    <span className="text-normal">
                      . The parties may file a Motion to Proceed Remotely. If
                      the Judge grants the motion, you will be provided with
                      detailed instructions, including the date, time, and
                      Zoomgov information for the remote proceeding.
                    </span>
                  </p>
                </li>
              </ol>
            </div>
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
              <span className="text-normal">
                If a party plans to call an expert witness at trial, that party
                must file an Expert Report (that is, submit separately through
                DAWSON if registered for eFiling or otherwise submit in paper)
                the expert report. An expert witness’s testimony may be excluded
                if the party fails to comply with this Order and Rule 143(g).
              </span>
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
              <span className="text-normal">
                The parties{' '}
                <span className="text-underline text-bold">must file</span> one
                of the following: a Proposed Stipulated Decision, a Pretrial
                Memorandum, a Motion to Dismiss for Lack of Prosecution, or a
                Status Report.
              </span>
            </p>
            <ol className="text-bold" type="A">
              <li>
                <p>
                  <span className="text-underline text-bold">Settlement</span>.{' '}
                  <span className="text-normal">
                    If a basis for settlement has been reached, the Proposed
                    Stipulated Decision must be electronically filed no later
                    than 21 days before the first day of the trial session. If
                    the parties have reached a basis for settlement and need
                    additional time to file the Proposed Stipulated Decision,
                    they must file a joint Status Report including a summary of
                    the basis of settlement no later than 21 days before the
                    first day of the trial session. A Stipulation of Settled
                    Issues should be filed concurrently, if available. The
                    Status Report must state the reasons for delay in filing the
                    Proposed Stipulated Decision. The Court may issue an Order
                    specifying the date by which the Proposed Stipulated
                    Decision will be due. If a basis for settlement is reached
                    after the trial session begins, the Court will handle any
                    required scheduling on the record.
                  </span>
                </p>
              </li>
              <li>
                <p>
                  <span className="text-underline text-bold">
                    Pretrial Memoranda
                  </span>
                  <span className="text-normal">
                    . If a basis for settlement has not been reached and it
                    appears that a trial is necessary, each party must file a
                    Pretrial Memorandum no later than 21 days before the first
                    day of the trial session. A Pretrial Memorandum form is
                    attached to this Order.
                  </span>
                </p>
                <ol className="text-bold" type="i">
                  <li>
                    <p>
                      <span className="text-underline text-bold">
                        {' '}
                        Witnesses
                      </span>
                      <span className="text-normal">
                        . Witnesses must be identified in the pretrial
                        memorandum with a brief summary of their anticipated
                        testimony. Witnesses who are not identified will not be
                        permitted to testify at the trial without a showing of
                        good cause.
                      </span>
                    </p>
                  </li>
                </ol>
              </li>
              <li>
                <p>
                  <span className="text-underline text-bold">
                    {' '}
                    Motion to Dismiss for Lack of Prosecution
                  </span>
                  <span className="text-normal">
                    . If a party has been unresponsive and has failed to
                    cooperate in preparing the case for trial or resolution or
                    to participate in preparing a Stipulation of Facts, the
                    opposing party should file a Motion to Dismiss for Lack of
                    Prosecution no later than 21 days before the first day of
                    the trial session.
                  </span>
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
              <span className="text-normal">
                The parties{' '}
                <span className="text-underline text-bold">must file</span> a
                Stipulation of Facts together with all stipulated documents.
                Documents and pages should be numbered for parties to easily
                identify documents and pages within documents.
              </span>
            </p>
            <ol className="text-bold" type="A">
              <li>
                <p>
                  <span className="text-underline text-bold">
                    Stipulation of Facts
                  </span>
                  <span className="text-normal">
                    . All facts and documents must be stipulated (agreed upon in
                    writing) to the maximum extent possible. If a complete
                    stipulation of facts is not ready for submission no later
                    than 14 days before the first day of the trial session, or
                    when otherwise ordered by the Court, and if the Court
                    determines that this is due to lack of cooperation by either
                    party, the Court may order sanctions against the
                    uncooperative party.
                  </span>
                </p>
              </li>
              <li>
                <p>
                  <span className="text-underline text-bold">
                    Proposed Trial Exhibits
                  </span>
                  <span className="text-normal">
                    . All documents or materials (except impeachment documents
                    or materials) that a party expects to use at trial that are
                    not in the Stipulation of Facts must be exchanged with the
                    opposing party as Proposed Trial Exhibits.
                  </span>
                </p>
              </li>
            </ol>
          </li>
          <li>
            <p>
              <span className="text-bold">No later than </span>
              <span className="text-underline">
                7 days before the first day of the trial session
              </span>
              <span className="text-normal">
                : The parties must file with the Court either a Supplemental
                Stipulation of Facts with any agreed Proposed Trial Exhibits or
                any unagreed Proposed Trial Exhibits. The Court may refuse to
                receive in evidence any document or material that is not filed
                as a Proposed Trial Exhibit no later than 7 days before the
                first day of the trial session. See the Court&apos;s website (
                <a href="https://www.ustaxcourt.gov">www.ustaxcourt.gov</a>) for
                instructions on identifying documents and numbering pages.
              </span>
            </p>
          </li>
          <li>
            <p>
              <span className="text-underline text-bold">
                Change in Case Status
              </span>
              <span className="text-normal">
                . A Status Report must be filed to inform the Court if the
                status of the case changes at any time before the trial date and
                after a Pretrial Memorandum, Motion to Dismiss for Lack of
                Prosecution, or Status Report is filed. Alternatively, if the
                case has settled, a Proposed Stipulated Decision may be filed.
              </span>
            </p>
          </li>
          <li>
            <p>
              <span className="text-underline text-bold">
                Remote Proceeding Access
              </span>
              <span className="text-normal">
                . If a remote proceeding is scheduled in your case, the parties
                must appear before the Judge as instructed in the Notice Setting
                Case for Trial. Information on how to use Zoomgov, including
                tips, can be found on the Court&apos;s website{' '}
                <a href="https://www.ustaxcourt.gov">www.ustaxcourt.gov</a>. A
                personal Zoom account is not required, and there is no cost to
                the parties. The parties are responsible for ensuring, to the
                best of their abilities, that they and their witnesses have
                adequate technology and internet resources to participate. The
                parties should log on and test their connections at least 30
                minutes before a remote proceeding is scheduled to begin.
              </span>
            </p>
          </li>
          <li>
            <p>
              <span className="text-underline text-bold">Time of Trial</span>
              <span className="text-normal">
                . All parties must be prepared for trial at any time during the
                trial session unless a specific date and time has been
                previously set by the Court. After Pretrial Memoranda are filed,
                the Court may schedule a specific date and time for the trial.
                The parties may also jointly contact the Judge’s chambers to
                request a specific date and time for the trial. If practicable,
                the Court will attempt to accommodate the request, keeping in
                mind other scheduling requirements and the anticipated length of
                the session. Parties should jointly inform the Judge as early as
                possible if they expect trial to require 3 days or more.
              </span>
            </p>
          </li>
        </ol>

        <p>
          <strong>
            If you do not follow the provisions of this Order, the Judge may
            dismiss your case and enter a Decision against you.
          </strong>
        </p>

        <div className="judge-signature">
          <p style={{ float: 'left', width: '40%' }}>
            Dated: {trialInfo.formattedServedDate}
          </p>
          <p
            style={{
              float: 'right',
              lineHeight: '18px',
              textAlign: 'right',
              width: '59%',
            }}
          >
            <span className="text-bold">
              (Signed) {trialInfo.formattedJudgeName}
            </span>
            <br />
            {trialInfo.chambersPhoneNumber}
          </p>
        </div>

        <br />
        <div style={{ pageBreakAfter: 'always' }}></div>
      </div>
    </div>
  );
};
