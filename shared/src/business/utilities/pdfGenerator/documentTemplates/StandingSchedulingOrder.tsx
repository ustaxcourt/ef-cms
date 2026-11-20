import { OrderDocketHeader } from '@shared/business/utilities/pdfGenerator/components/OrderDocketHeader';
import { OrderPrimaryHeader } from '@shared/business/utilities/pdfGenerator/components/OrderPrimaryHeader';
import { PretrialMemorandum } from '@shared/business/utilities/pdfGenerator/components/PretrialMemorandum';
import { TROUBLESHOOTING_INFO } from '@shared/business/entities/EntityConstants';
import React from 'react';

export type StandingSchedulingOrderTrialInfo = {
  chambersPhoneNumber: string;
  formattedDueDate: string;
  formattedDueDateWithDayOfWeek: string;
  formattedJudgeName: string;
  formattedServedDate: string;
  trialLocation: string;
};

export type StandingSchedulingOrderParams = {
  options: {
    caseCaptionExtension: string;
    caseTitle: string;
    docketNumberWithSuffix: string;
  };
  trialInfo: StandingSchedulingOrderTrialInfo;
};

const DueDate = ({ formattedDueDate }: { formattedDueDate: string }) => (
  <span className="text-underline text-bold">{formattedDueDate}</span>
);

export const StandingSchedulingOrder = ({
  options,
  trialInfo,
}: StandingSchedulingOrderParams) => {
  return (
    <div id="standing-scheduling-order">
      <div>
        <OrderPrimaryHeader />
        <OrderDocketHeader
          caseCaptionExtension={options.caseCaptionExtension}
          caseTitle={options.caseTitle.toUpperCase()}
          docketNumberWithSuffix={options.docketNumberWithSuffix}
        />

        <div
          className="text-center standing-scheduling-card"
          id="due-date-information-card"
        >
          <p>
            Pretrial Memorandum Due Date – no later than{' '}
            <span className="text-bold">
              {trialInfo.formattedDueDateWithDayOfWeek}
            </span>
            .
          </p>
          <p>
            Please refer to the Notice of Assignment of Judge for more
            information.
          </p>
        </div>

        <h3 className="text-center text-underline text-bold margin-top-0">
          Standing Scheduling Order
        </h3>

        <p className="text-bold">
          This Order sets out the Court’s standing procedures for preparing this
          case for trial.
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
          <a href={`mailto:${TROUBLESHOOTING_INFO.APP_SUPPORT_EMAIL}`}>
            {TROUBLESHOOTING_INFO.APP_SUPPORT_EMAIL}
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
            conference calls and pretrial conferences, the Judge may dismiss
            your case and enter a decision against you.
          </span>{' '}
          Any failures may also be considered in relation to sanctions against
          and disciplinary proceedings involving counsel. See Rule 202(a).
        </p>

        <p>To allow the efficient disposition of this case:</p>

        <p>
          It is ORDERED that the parties comply with the following deadlines and
          requirements, unless the Court, upon request, grants an extension:
        </p>

        <ol className="text-bold inline-ol">
          <li>
            <p>
              <span className="text-bold">
                <span className="text-underline">Pretrial memorandum</span>
                :{' '}
              </span>
              <span className="text-normal">
                Any pretrial memorandum from a party must be filed{' '}
              </span>
              <span className="text-bold">no later than </span>
              <DueDate formattedDueDate={trialInfo.formattedDueDate} />
              <span className="text-bold">.</span>
            </p>
            <ol className="text-bold" type="A">
              <li>
                <p>
                  <span className="text-normal">
                    If a basis for settlement has not been reached and it
                    appears that a trial is necessary, a pretrial memorandum
                    should be filed. A pretrial memorandum form is attached to
                    this Order.{' '}
                  </span>
                  <span className="text-underline text-bold">
                    Parties submitting a pretrial memorandum should be prepared
                    for prompt scheduling of their case for trial.
                  </span>
                </p>
              </li>
              <li>
                <p>
                  <span className="text-underline text-bold">Witnesses</span>
                  <span className="text-normal">
                    . Witnesses, including expert witnesses, must be identified
                    in the pretrial memorandum with a brief summary of their
                    anticipated testimony. Witnesses who are not identified will
                    not be permitted to testify at the trial without a showing
                    of good cause.
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
                  45 days after the issuance of this Order
                </span>
                :{' '}
              </span>
              <span className="text-normal">
                If judicial review of the Commissioner’s determination
                ordinarily would be based on the administrative record, the
                parties must file the entire administrative record (or so much
                of that record as either party may deem necessary for a complete
                disposition of the issue or issues in dispute) stipulated as to
                its genuineness.
              </span>
            </p>
          </li>
          <li>
            <p>
              <span className="text-bold">
                No later than{' '}
                <span className="text-underline">
                  60 days after the issuance of this Order
                </span>
                :{' '}
              </span>
              <span className="text-normal">
                If a party contends that the administrative record is incomplete
                or should be supplemented, that party must file a motion to
                complete or supplement the administrative record.
              </span>
            </p>
          </li>
          <li>
            <p>
              <span className="text-bold">
                No later than{' '}
                <span className="text-underline">
                  60 days before the due date of the pretrial memorandum
                </span>
                :{' '}
              </span>
              <span className="text-normal">
                If a party wants to ask the Judge to decide all or part of the
                case without trial, the party must file a Motion for Summary
                Judgment.
              </span>
            </p>
          </li>
          <li>
            <p>
              <span className="text-bold">
                No later than{' '}
                <span className="text-underline">
                  45 days before the due date of the pretrial memorandum
                </span>
                :{' '}
              </span>
              <span className="text-normal">
                The parties must file any motions related to discovery or
                stipulations.
              </span>
            </p>
          </li>
          <li>
            <p>
              <span className="text-bold">
                No later than{' '}
                <span className="text-underline">
                  31 days before the due date of the pretrial memorandum
                </span>
                :{' '}
              </span>
              <span className="text-normal">
                The parties must file a Motion to Proceed Remotely. If the Judge
                grants the motion, you will be provided with detailed
                instructions, including the date, time, and Zoomgov information
                for the remote proceeding.
              </span>
            </p>
          </li>
          <li>
            <p>
              <span className="text-bold">
                <span className="text-underline">
                  On the due date of the pretrial memorandum
                </span>
                :{' '}
              </span>
              <span className="text-normal">
                Unless the parties file a pretrial memorandum, they{' '}
                <span className="text-underline text-bold">must file</span> one
                of the following: a Proposed Stipulated Decision, a Motion to
                Dismiss for Lack of Prosecution, or a Status Report.
              </span>
            </p>
            <ol className="text-bold" type="A">
              <li>
                <p>
                  <span className="text-underline text-bold">Settlement</span>
                  <span className="text-bold">. </span>
                  <span className="text-normal">
                    If a basis for settlement has been reached and a Proposed
                    Stipulated Decision is ready, it must be filed
                    electronically no later than{' '}
                  </span>
                  <DueDate formattedDueDate={trialInfo.formattedDueDate} />
                  <span className="text-normal">
                    . If the parties have reached a basis for settlement and
                    need additional time to file the Proposed Stipulated
                    Decision, they must file a joint Status Report including a
                    summary of the basis of settlement no later than{' '}
                  </span>
                  <DueDate formattedDueDate={trialInfo.formattedDueDate} />
                  <span className="text-normal">
                    . A Stipulation of Settled Issues should be filed
                    concurrently, if available. The Status Report must state the
                    reasons for delay in filing the Proposed Stipulated
                    Decision. The Court may issue an Order specifying the date
                    by which the Proposed Stipulated Decision will be due.
                  </span>
                </p>
              </li>
              <li>
                <p>
                  <span className="text-underline text-bold">
                    Motion to Dismiss for Lack of Prosecution
                  </span>
                  <span className="text-normal">
                    . If a party has been unresponsive and has failed to
                    cooperate in preparing the case for trial or resolution or
                    to participate in preparing a Stipulation of Facts, the
                    opposing party should file a Motion to Dismiss for Lack of
                    Prosecution no later than{' '}
                  </span>
                  <DueDate formattedDueDate={trialInfo.formattedDueDate} />
                  <span className="text-normal">.</span>
                </p>
              </li>
            </ol>
          </li>
        </ol>

        <div className="standing-scheduling-closing">
          <p>
            <strong>
              If you do not follow the provisions of this Order, the Judge may
              dismiss your case and enter a Decision against you.
            </strong>
          </p>

          <div className="standing-scheduling-signature">
            <p>Dated: {trialInfo.formattedServedDate}</p>
            <p className="standing-scheduling-signature-judge">
              <span className="text-bold">
                (Signed) {trialInfo.formattedJudgeName}
              </span>
              <br />
              {trialInfo.chambersPhoneNumber}
            </p>
          </div>
        </div>

        <div style={{ pageBreakAfter: 'always' }}></div>

        <PretrialMemorandum
          showTrialCalendarLabel={false}
          trialInfo={{
            chambersPhoneNumber: trialInfo.chambersPhoneNumber,
            formattedJudgeName: trialInfo.formattedJudgeName,
            formattedStartDate: trialInfo.formattedDueDate,
            formattedTrialLocation: trialInfo.trialLocation,
          }}
        />
      </div>
    </div>
  );
};
