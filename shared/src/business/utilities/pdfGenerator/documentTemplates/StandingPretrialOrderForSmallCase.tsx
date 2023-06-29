import React from 'react';

import { OrderDocketHeader } from '../components/OrderDocketHeader.tsx';
import { OrderPrimaryHeader } from '../components/OrderPrimaryHeader.tsx';

export const StandingPretrialOrderForSmallCase = ({ options, trialInfo }) => {
  return (
    <div id="standing-pretrial-order">
      <div className="standing-pretrial-order-small-case">
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
          Standing Pretrial Order for Small Tax Cases
        </h3>

        <p>
          <b>
            Read this Order because it sets out the Court’s standing procedures
            for the trial session. It explains actions you are required to take
            (ordered) and important information you need to pay attention to. If
            this is your first time appearing before the U.S. Tax Court,{' '}
            <span className="text-underline">
              please pay special attention to the attached “Petitioner’s
              (Taxpayer’s) Getting Ready for Trial Checklist”
            </span>
          </b>
          .
        </p>

        <p>
          <b>
            &emsp;The parties are ORDERED to (1) participate in pre-trial
            matters, including conference calls and pretrial conferences
            scheduled by the Judge, and (2) attend the trial. If you do not
            follow this Order, the Judge may dismiss your case and enter a
            Decision against you.
          </b>
        </p>

        <p>
          <b>Important information you need to pay attention to:</b>
        </p>

        <ol className="inline-ol">
          <li>
            <span className="text-underline text-bold">About the Court</span>.
            The U.S. Tax Court hears disputes between taxpayers (petitioners)
            and the IRS (respondent). The Court is independent of, and not
            affiliated with, the IRS. Documents previously given to the IRS are
            not part of the record in this case and may not be considered unless
            made part of this case.
          </li>

          <li>
            <span className="text-underline text-bold">
              Contact Information
            </span>
            . The parties must provide the Court with current contact
            information. If your phone number, email, or mailing address
            changes, inform the Court right away by filing a Notice of Change of
            Address form, available on the Court’s website,{' '}
            <a href="https://www.ustaxcourt.gov">www.ustaxcourt.gov</a>.
          </li>

          <li>
            <span className="text-underline text-bold">
              Electronic Filing (eFiling)
            </span>
            . The Court encourages registration for DAWSON, the Court’s
            electronic filing and case management system, so that you can
            electronically file and view documents in your case. If you are not
            registered for eFiling, you must send the opposing party a copy of
            any document you file with the Court. To register for DAWSON, email{' '}
            <a href="mailto:dawson.support@ustaxcourt.gov">
              dawson.support@ustaxcourt.gov
            </a>
            . eFiling will remain available to parties during the trial session.
            For more information, see{' '}
            <a href="https://www.ustaxcourt.gov">www.ustaxcourt.gov</a>.
          </li>

          <li>
            <span className="text-underline text-bold">
              Communication Between the Parties
            </span>
            . The parties must begin discussing settlement and/or preparation of
            a stipulation of facts (facts on which the parties agree) as soon as
            possible. All minor issues should be settled so that the Judge can
            focus on the issue(s) needing a decision. Some cases may be
            susceptible to partial or full settlement, and the Court expects the
            parties to negotiate in good faith with this goal in mind. If a
            party has trouble communicating with another party or complying with
            this Order, that party should tell the Judge right away by filing a
            Status Report or requesting a conference call by calling the Judge’s
            chambers at the phone number listed below.
          </li>

          <li>
            <span className="text-underline text-bold">Language Barriers</span>.
            All Court proceedings are conducted in English. All documents must
            be filed in English or include a certified English translation. You
            should let the Judge know as early as possible if you require help
            with English. It is generally the responsibility of each petitioner
            to bring an interpreter. If you give advance notice, the Court may
            have one available.
          </li>

          <li>
            <span className="text-underline text-bold">
              Readiness for Trial and Participation
            </span>
            . If your case needs a trial, the parties must be ready for trial
            when scheduled by the Judge. If you need special help with
            scheduling your trial, call the Judge’s chambers (at the telephone
            number listed below) as early as possible and before the first day
            of the trial session. If you have not yet settled your case and you
            do not participate in conference calls and pretrial conferences, or
            appear at trial, the Judge may dismiss your case and enter a
            decision against you.{' '}
            <span className="text-bold">
              The Judge may also dismiss your case and enter a decision against
              you if you do not follow this or other Court Orders.{' '}
            </span>
          </li>

          <li>
            <span className="text-underline text-bold">Relevant Deadlines</span>
            . The Court has adopted the deadlines outlined below to facilitate
            the resolution of cases and draws the parties’ attention to them.
          </li>

          <ol type="a">
            <li>
              <span className="text-bold">No later than </span>
              <span className="text-underline text-bold">
                60 days before the first day of the trial session
              </span>
              : If a party wants to ask the Judge to decide all or part of the
              case without trial, the party may file a Motion for Summary
              Judgment.
            </li>

            <li>
              <span className="text-bold">No later than </span>
              <span className="text-underline text-bold">
                45 days before the first day of the trial session
              </span>
              : The parties should file any motions related to discovery or
              stipulations.
            </li>

            <li>
              <span className="text-bold">No later than </span>
              <span className="text-underline text-bold">
                31 days before the first day of the trial session
              </span>
              :{' '}
              <ol type="i">
                <li>
                  <p>
                    <span className="text-underline text-bold">
                      {' '}
                      Motion for Continuance
                    </span>
                    <span className="text-normal">
                      . The parties may file any Motions for Continuance
                      (postponement of trial), which the Judge will grant only
                      in exceptional circumstances. See Rule 133, Tax Court
                      Rules of Practice and Procedure (available at{' '}
                      <a href="https://www.ustaxcourt.gov">
                        www.ustaxcourt.gov
                      </a>
                      ). Even joint Motions for Continuance are not
                      automatically granted.
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
                      . If either party wants to proceed remotely (using
                      Zoomgov) instead of having an in-person trial, that party
                      may file a Motion to Proceed Remotely. If the Judge grants
                      the motion, you will be provided with detailed
                      instructions, including the date, time, and Zoomgov
                      information for the remote proceeding.
                    </span>
                  </p>
                </li>
              </ol>
            </li>

            <li>
              <span className="text-bold">No later than </span>
              <span className="text-underline text-bold">
                21 days before the first day of the trial session
              </span>
              : The parties should file one of the following: a Proposed
              Stipulated Decision, a Pretrial Memorandum, a Motion to Dismiss
              for Lack of Prosecution, or a Status Report.
              <ol type="i">
                <li>
                  <p>
                    <span className="text-underline text-bold">
                      {' '}
                      Settlement
                    </span>
                    <span className="text-normal">
                      . If a basis for settlement has been reached, the Proposed
                      Stipulated Decision must be electronically filed no later
                      than 21 days before the first day of the trial session. If
                      the parties have reached a basis for settlement and need
                      additional time to file the Proposed Stipulated Decision,
                      they must file a joint Status Report including a summary
                      of the basis of settlement no later than 21 days before
                      the first day of the trial session. A Stipulation of
                      Settled Issues should be filed concurrently, if available.
                      The Status Report must state the reasons for delay in
                      filing the Proposed Stipulated Decision. The Court may
                      issue an Order specifying the date by which the Proposed
                      Stipulated Decision will be due. If a basis for settlement
                      is reached after the trial session begins, the Court will
                      handle any required scheduling on the record.
                    </span>
                  </p>
                </li>
                <li>
                  <p>
                    <span className="text-underline text-bold">
                      {' '}
                      Pretrial Memoranda
                    </span>
                    <span className="text-normal">
                      . If a basis for settlement has not been reached and it
                      appears that a trial is necessary, each party should file
                      a Pretrial Memorandum no later than 21 days before the
                      first day of the trial session. You can use the Pretrial
                      Memorandum form attached to this Order. The Pretrial
                      Memorandum should identify witnesses the party expects to
                      call and provide a brief summary of the witnesses’
                      anticipated testimony.
                    </span>
                  </p>
                </li>
                <li>
                  <p>
                    <span className="text-underline text-bold">
                      {' '}
                      Motion to Dismiss for Lack of Prosecution
                    </span>
                    <span className="text-normal">
                      . If a party has not (1) responded to telephone calls from
                      the other party, (2) cooperated in preparing the case for
                      trial, or (3) agreed in writing to facts and documents,
                      the other party may file a Motion to Dismiss for Lack of
                      Prosecution no later than 21 days before the first day of
                      the trial session.
                    </span>
                  </p>
                </li>
              </ol>
            </li>

            <li>
              <span className="text-bold">No later than </span>
              <span className="text-underline text-bold">
                14 days before the first day of the trial session
              </span>
              :{' '}
              <ol type="i">
                <li>
                  <p>
                    <span className="text-underline text-bold">
                      {' '}
                      Stipulation of Facts and Exhibits
                    </span>
                    <span className="text-normal">
                      . The parties must file a Stipulation of Facts together
                      with all stipulated documents. Documents and pages should
                      be numbered for parties to easily identify documents and
                      pages within documents. The parties should agree in
                      writing (stipulate) before the trial begins as to all
                      relevant facts and documents that they do not dispute.
                      Examples might include tax returns for the years involved
                      and the notice issued by the IRS.
                    </span>
                  </p>
                </li>
                <li>
                  <p>
                    <span className="text-underline text-bold">
                      {' '}
                      Proposed Trial Exhibits
                    </span>
                    <span className="text-normal">
                      . All documents or materials (except impeachment documents
                      or materials) that a party expects to use at trial that
                      are not in the Stipulation of Facts should be exchanged as
                      Proposed Trial Exhibits no later than 14 days before the
                      first day of the trial session.
                    </span>
                  </p>
                </li>
              </ol>
            </li>

            <li>
              <span className="text-bold">No later than </span>
              <span className="text-underline text-bold">
                7 days before the first day of the trial session
              </span>
              : The parties should file with the Court either a Supplemental
              Stipulation of Facts with any agreed Proposed Trial Exhibits or
              any unagreed Proposed Trial Exhibits. See the Court’s website{' '}
              <a href="https://www.ustaxcourt.gov">www.ustaxcourt.gov</a> for
              instructions on identifying documents and numbering pages.
            </li>
          </ol>

          <li>
            <span className="text-underline text-bold">
              {' '}
              Change in Case Status
            </span>
            . A Status Report must be filed to inform the Court if the status of
            the case changes at any time before the trial date and after a
            Pretrial Memorandum, Motion to Dismiss for Lack of Prosecution, or
            Status Report is filed. Alternatively, if the case has settled, a
            Proposed Stipulated Decision may be filed.
          </li>

          <li>
            <span className="text-underline text-bold">
              Remote Proceeding Access
            </span>
            . If a remote proceeding is scheduled in your case, the parties must
            appear before the Judge as instructed in the Notice Setting Case for
            Trial. Information on how to use Zoomgov, including tips, can be
            found on the Court’s website,{' '}
            <a href="https://www.ustaxcourt.gov">www.ustaxcourt.gov</a>. A
            personal Zoom account is not required, and there is no cost to the
            parties. The parties are responsible for ensuring, to the best of
            their abilities, that they and their witnesses have adequate
            technology and internet resources to participate. The parties should
            log on and test their connections at least 30 minutes before a
            remote proceeding is scheduled to begin.
          </li>

          <li>
            <span className="text-underline text-bold">Time of Trial</span>. All
            parties <b>must</b> be prepared for trial at any time during the
            trial session unless a specific date and time has been previously
            set by the Court. After Pretrial Memoranda are filed, the Court may
            schedule a specific date and time for the trial. The parties may
            also jointly contact the Judge’s chambers to request a specific date
            and time for the trial. If practicable, the Court will attempt to
            accommodate the request, keeping in mind other scheduling
            requirements and the anticipated length of the session. The parties
            and any witnesses must be ready to participate at the time the trial
            starts. Testimony given by you or your witnesses during the trial is
            considered evidence.
          </li>
        </ol>
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
            <b>(Signed) {trialInfo.formattedJudgeName}</b>
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
