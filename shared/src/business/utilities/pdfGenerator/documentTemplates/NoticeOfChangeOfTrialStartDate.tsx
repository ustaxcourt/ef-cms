import { ChangeOfTrialStartDateDocketHeader } from '@shared/business/utilities/pdfGenerator/components/ChangeOfTrialStartDateDocketHeader';
import { OrderPrimaryHeader } from '@shared/business/utilities/pdfGenerator/components/OrderPrimaryHeader';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { formatDateString } from '@shared/business/utilities/DateHandler';

import React from 'react';

export type TrialSessionStartDateChangePDFInfo = Pick<
  RawTrialSession,
  | 'trialSessionId'
  | 'judge'
  | 'address1'
  | 'address2'
  | 'city'
  | 'state'
  | 'postalCode'
  | 'courthouseName'
  | 'startDate'
  | 'trialLocation'
>;

export const NoticeOfChangeOfTrialStartDate = ({
  caseCaptionExtension,
  caseTitle,
  docketNumberWithSuffix,
  previousTrialSession,
  updatedTrialSession,
}: {
  caseCaptionExtension: string;
  caseTitle: string;
  docketNumberWithSuffix: string;
  previousTrialSession: TrialSessionStartDateChangePDFInfo;
  updatedTrialSession: TrialSessionStartDateChangePDFInfo;
}) => {
  return (
    <div>
      <OrderPrimaryHeader />
      <ChangeOfTrialStartDateDocketHeader
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
        documentTitle="NOTICE OF CHANGE OF TRIAL START DATE"
      />
      <NoticeOfChangeRemote />
    </div>
  );
};

function NoticeOfChangeRemote() {
  return (
    <div>
      <p>
        The [TRIAL_LOCATION] [SESSION_TYPE] trial session scheduled to begin on
        [OLD_START_DATE], has been changed to [NEW_START_DATE], beginning at
        [TIME]. The calendar will be called at that date and time, and the
        parties are directed to appear before the Court at a remote proceeding
        to be held using Zoom.gov and to be prepared to try the case. The
        parties shall follow the instructions below for how to participate in
        the remote proceeding.
      </p>
      <h3>ACCESS REMOTE PROCEEDING</h3>
      <p>Your Meeting ID and Passcode for the remote proceeding are:</p>
      <p>Meeting ID: [MEETING_ID]</p>
      <p>Passcode: [MEETING_PASS]</p>
      <p>
        Join online: Go to www.zoomgov.com and click `Join a meeting` (blue box
        in the middle of the page). Enter the Meeting ID and Passcode above when
        prompted.
      </p>
      <p>
        The parties are further notified that the previously issued Standing
        Pretrial Order remains in full force and effect except to the extent
        modified above.
      </p>
    </div>
  );
}
