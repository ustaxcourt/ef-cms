import { ChangeOfTrialStartDateDocketHeader } from '@shared/business/utilities/pdfGenerator/components/ChangeOfTrialStartDateDocketHeader';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import {
  formatDateString,
  FORMATS,
} from '@shared/business/utilities/DateHandler';

import React from 'react';
import { TRIAL_SESSION_PROCEEDING_TYPES } from '@shared/business/entities/EntityConstants';
import { PrimaryHeader } from '@shared/business/utilities/pdfGenerator/components/PrimaryHeader';
import { ClerkOfTheCourtSignature } from '@shared/business/utilities/pdfGenerator/components/ClerkOfTheCourtSignature';

export type TrialSessionStartDateChangePDFInfo = RawTrialSession;

export const NoticeOfChangeOfTrialStartDate = ({
  caseCaptionExtension,
  caseTitle,
  docketNumberWithSuffix,
  previousTrialSession,
  updatedTrialSession,
  clerkOfTheCourtRecord,
}: {
  caseCaptionExtension: string;
  caseTitle: string;
  docketNumberWithSuffix: string;
  previousTrialSession: TrialSessionStartDateChangePDFInfo;
  updatedTrialSession: TrialSessionStartDateChangePDFInfo;
  clerkOfTheCourtRecord: { name: string; title: string };
}) => {
  return (
    <div>
      <PrimaryHeader />
      <ChangeOfTrialStartDateDocketHeader
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
        documentTitle="NOTICE OF CHANGE OF TRIAL DATE"
      />
      {updatedTrialSession.proceedingType ===
      TRIAL_SESSION_PROCEEDING_TYPES.inPerson ? (
        <NoticeOfChangeInPerson
          previousTrialSession={previousTrialSession}
          updatedTrialSession={updatedTrialSession}
        />
      ) : (
        <NoticeOfChangeRemote
          previousTrialSession={previousTrialSession}
          updatedTrialSession={updatedTrialSession}
        />
      )}
      <p>
        &emsp;The parties are further notified that the previously issued
        Standing Pretrial Order remains in full force and effect except to the
        extent modified above.
      </p>
      <ClerkOfTheCourtSignature
        nameOfClerk={clerkOfTheCourtRecord.name}
        titleOfClerk={clerkOfTheCourtRecord.title}
      />
    </div>
  );
};

function NoticeOfChangeRemote({
  previousTrialSession,
  updatedTrialSession,
}: {
  previousTrialSession: TrialSessionStartDateChangePDFInfo;
  updatedTrialSession: TrialSessionStartDateChangePDFInfo;
}) {
  return (
    <div>
      <p>
        &emsp;The {updatedTrialSession.trialLocation}{' '}
        {updatedTrialSession.sessionType} trial session scheduled to begin on{' '}
        {formatDateString(previousTrialSession.startDate, FORMATS.MMDDYYYY)},
        has been changed to{' '}
        {formatDateString(updatedTrialSession.startDate, FORMATS.MMDDYYYY)},
        beginning at {updatedTrialSession.startTime}. The calendar will be
        called at that date and time, and the parties are directed to appear
        before the Court at a remote proceeding to be held using Zoom.gov and to
        be prepared to try the case. The parties shall follow the instructions
        below for how to participate in the remote proceeding.
      </p>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontWeight: 'bold' }}>ACCESS REMOTE PROCEEDING</p>
        <p>Your Meeting ID and Passcode for the remote proceeding are:</p>
        <p>
          <span style={{ fontWeight: 'bold' }}>Meeting ID:</span>{' '}
          {updatedTrialSession.meetingId}
        </p>
        <p>
          <span style={{ fontWeight: 'bold' }}>Passcode:</span>{' '}
          {updatedTrialSession.password}
        </p>
      </div>
      <p>
        &emsp;Join online: Go to www.zoomgov.com and click `Join a meeting` (blue box
        in the middle of the page). Enter the Meeting ID and Passcode above when
        prompted.
      </p>
    </div>
  );
}

function NoticeOfChangeInPerson({
  previousTrialSession,
  updatedTrialSession,
}: {
  previousTrialSession: TrialSessionStartDateChangePDFInfo;
  updatedTrialSession: TrialSessionStartDateChangePDFInfo;
}) {
  return (
    <div>
      <p>
        &emsp;The {updatedTrialSession.trialLocation}{' '}
        {updatedTrialSession.sessionType} trial session scheduled to begin on{' '}
        {formatDateString(previousTrialSession.startDate, FORMATS.MMDDYYYY)},
        has been changed to{' '}
        {formatDateString(updatedTrialSession.startDate, FORMATS.MMDDYYYY)},
        beginning at {updatedTrialSession.startTime}. The calendar will be
        called at that date and time, and the parties are expected to be present
        and to be prepared to try the case. The trial session will be held at{' '}
        {updatedTrialSession.courthouseName}, {updatedTrialSession.address1}{' '}
        {updatedTrialSession.address2 ? `${updatedTrialSession.address2} ` : ''}
        {updatedTrialSession.city} {updatedTrialSession.state}{' '}
        {updatedTrialSession.postalCode}.
      </p>
    </div>
  );
}
