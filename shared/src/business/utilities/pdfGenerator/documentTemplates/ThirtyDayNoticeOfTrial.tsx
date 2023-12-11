import { ClerkOfTheCourtSignature } from '../components/ClerkOfTheCourtSignature';
import { DocketHeader } from '../components/DocketHeader';
import { FORMATS, formatDateString } from '../../DateHandler';
import { PrimaryHeader } from '../components/PrimaryHeader';
import {
  TRIAL_SESSION_PROCEEDING_TYPES,
  TRIAL_SESSION_SCOPE_TYPES,
  TrialSessionProceedingType,
  TrialSessionScope,
} from '../../../entities/EntityConstants';
import React from 'react';

export type ThirtyDayNoticeOfTrialRequiredInfo = {
  caseCaptionExtension: string;
  caseTitle: string;
  docketNumberWithSuffix: string;
  trialLocation: TrialLocation;
  trialDate: string;
  judgeName: string;
  dateServed: string;
  proceedingType: TrialSessionProceedingType;
  scopeType: TrialSessionScope;
  nameOfClerk: string;
  titleOfClerk: string;
};

type TrialLocation = {
  address1?: string;
  address2?: string;
  courthouseName?: string;
  cityState?: string;
  postalCode?: string;
};

const InPersonTrialLocationBox = ({
  address1,
  address2,
  cityState,
  courthouseName,
  postalCode,
}: TrialLocation) => {
  return (
    <div className="info-box info-box-trial" id="trial-info">
      <div className="info-box-header">Trial At</div>
      <div className="info-box-content">
        {courthouseName && <div>{courthouseName}</div>}
        <div>{address1}</div>
        {address2 && <div>{address2}</div>}
        <div>
          {cityState} {postalCode}
        </div>
        <div className="text-bold">In Person</div>
      </div>
    </div>
  );
};
const RemoteTrialLocationBox = ({ cityState }: { cityState: string }) => {
  return (
    <div className="info-box info-box-trial" id="trial-info">
      <div className="info-box-header">Trial At</div>
      <div className="info-box-content">
        <div>{cityState}</div>
        <div className="text-bold">Remote Proceeding</div>
      </div>
    </div>
  );
};
const StandaloneRemoteTrialLocationBox = () => {
  return (
    <div className="info-box info-box-trial" id="trial-info">
      <div className="info-box-header">Trial At</div>
      <div className="info-box-content">
        <div className="text-bold">Remote Proceeding</div>
      </div>
    </div>
  );
};

const InPersonParagraph1 = ({
  formattedTrialDate,
}: {
  formattedTrialDate: string;
}) => {
  return (
    <p>
      The parties are reminded that this case is calendared for trial or hearing
      at the Trial Session beginning{' '}
      <span className="text-bold">{formattedTrialDate}</span>. This case will
      remain on the Court’s trial calendar unless: (1) both parties sign an
      agreed decision and submit it to the Court or (2) the Court otherwise
      notifies the parties that it is removing the case from the trial calendar.
      If this case remains on the Court’s trial calendar and you fail to appear
      at the Trial Session, the case may be dismissed.
    </p>
  );
};
const RemoteParagraph1 = ({
  formattedTrialMonthDayYear,
}: {
  formattedTrialMonthDayYear: string;
}) => {
  return (
    <p>
      The parties are reminded that this case is calendared for trial or hearing
      at the Trial Session beginning at{' '}
      <span className="text-bold">
        10:00 AM local time on {formattedTrialMonthDayYear} at the location
        shown above,
      </span>{' '}
      as a remote proceeding using Zoomgov. This case will remain on the Court’s
      trial calendar unless: (1) both parties sign an agreed decision and submit
      it to the Court or (2) the Court otherwise notifies the parties that it is
      removing the case from the trial calendar. If this case remains on the
      Court’s trial calendar and you fail to appear at the Trial Session, the
      case may be dismissed.
    </p>
  );
};
const StandaloneRemoteParagraph1 = ({
  formattedTrialMonthDayYear,
}: {
  formattedTrialMonthDayYear: string;
}) => {
  return (
    <p>
      The parties are reminded that this case is calendared for trial or hearing
      at the Trial Session beginning at{' '}
      <span className="text-bold">
        1:00 PM Eastern time (ET), on {formattedTrialMonthDayYear}
      </span>{' '}
      as a remote proceeding using Zoomgov. This case will remain on the Court’s
      trial calendar unless: (1) both parties sign an agreed decision and submit
      it to the Court or (2) the Court otherwise notifies the parties that it is
      removing the case from the trial calendar. If this case remains on the
      Court’s trial calendar and you fail to appear at the Trial Session, the
      case may be dismissed.
    </p>
  );
};

const InPersonParagraph2 = () => {
  return (
    <p>
      According to the Court’s records, petitioner(s) in this case is (are) not
      represented by counsel. The parties should arrive at the Court by
      <span className="text-bold">
        {' '}
        9 AM local time at the location shown above{' '}
      </span>
      to be ready for the 10 AM calendar call. Arriving by 9:00 AM will enable
      petitioners and Respondent’s counsel to discuss any remaining matters
      pertaining to the case and learn what will be expected if the case is to
      be tried. Petitioners should identify themselves to the trial clerk (a Tax
      Court employee) when they enter the courtroom.
    </p>
  );
};
const RemoteParagraph2 = () => {
  return (
    <p>
      According to the Court’s records, petitioner(s) in this case is (are) not
      represented by counsel. It is the responsibility of the person making a
      remote appearance to access the remote proceeding from a location where he
      or she can be clearly seen and heard. The parties shall access the remote
      proceeding no later than <span className="text-bold"> 10 minutes </span>
      before the start of the 10:00 AM calendar call. Petitioners should
      identify themselves to the Trial Clerk (a Tax Court employee), giving
      their name and docket number. Petitioners may enter the remote proceeding
      <span className="text-bold"> as early as 9:00 AM </span> to enable a
      discussion with Respondent’s counsel regarding any remaining matters
      pertaining to the case and to learn what will be expected if the case is
      to be tried.
    </p>
  );
};
const StandaloneRemoteParagraph2 = () => {
  return (
    <p>
      According to the Court’s records, petitioner(s) in this case is (are) not
      represented by counsel. It is the responsibility of the person making a
      remote appearance to access the remote proceeding from a location where he
      or she can be clearly seen and heard. The parties shall access the remote
      proceeding no later than <span className="text-bold"> 10 minutes </span>
      before the start of the 1:00 PM ET calendar call. Petitioners should
      identify themselves to the Trial Clerk (a Tax Court employee), giving
      their name and docket number. Petitioners may enter the remote proceeding
      <span className="text-bold"> as early as 12:00 PM ET </span> to enable a
      discussion with Respondent’s counsel regarding any remaining matters
      pertaining to the case and to learn what will be expected if the case is
      to be tried.
    </p>
  );
};

const JudgeBox = ({ judgeName }: { judgeName: string }) => {
  return (
    <div className="info-box info-box-judge" id="judge-info">
      <div className="info-box-header">Judge</div>
      <div className="info-box-content">{judgeName}</div>
    </div>
  );
};

export const ThirtyDayNoticeOfTrial = ({
  caseCaptionExtension,
  caseTitle,
  docketNumberWithSuffix,
  judgeName,
  nameOfClerk,
  proceedingType,
  scopeType,
  titleOfClerk,
  trialDate,
  trialLocation,
}: ThirtyDayNoticeOfTrialRequiredInfo) => {
  const formattedTrialDate = formatDateString(
    trialDate,
    FORMATS.MONTH_DAY_YEAR_WITH_DAY_OF_WEEK,
  );

  const formattedTrialMonthDayYear = formatDateString(
    trialDate,
    FORMATS.MONTH_DAY_YEAR,
  );

  const isInPerson =
    proceedingType === TRIAL_SESSION_PROCEEDING_TYPES.inPerson &&
    scopeType === TRIAL_SESSION_SCOPE_TYPES.locationBased;
  const isRemote =
    proceedingType === TRIAL_SESSION_PROCEEDING_TYPES.remote &&
    scopeType === TRIAL_SESSION_SCOPE_TYPES.locationBased;
  const isStandaloneRemote =
    scopeType === TRIAL_SESSION_SCOPE_TYPES.standaloneRemote;

  return (
    <div id="thirty-day-notice-of-trial-pdf">
      <PrimaryHeader />
      <DocketHeader
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
        documentTitle="Notice"
      />
      <div>
        {isInPerson && (
          <InPersonTrialLocationBox
            address1={trialLocation.address1}
            address2={trialLocation.address2}
            cityState={trialLocation.cityState}
            courthouseName={trialLocation.courthouseName}
            postalCode={trialLocation.postalCode}
          />
        )}

        {isRemote && (
          <RemoteTrialLocationBox cityState={trialLocation.cityState!} />
        )}

        {isStandaloneRemote && <StandaloneRemoteTrialLocationBox />}

        <JudgeBox judgeName={judgeName} />
        <div className="clear" />
      </div>

      <div id="notice-body">
        {isInPerson && (
          <InPersonParagraph1 formattedTrialDate={formattedTrialDate} />
        )}
        {isRemote && (
          <RemoteParagraph1
            formattedTrialMonthDayYear={formattedTrialMonthDayYear}
          />
        )}
        {isStandaloneRemote && (
          <StandaloneRemoteParagraph1
            formattedTrialMonthDayYear={formattedTrialMonthDayYear}
          />
        )}

        {isInPerson && <InPersonParagraph2 />}
        {isRemote && <RemoteParagraph2 />}
        {isStandaloneRemote && <StandaloneRemoteParagraph2 />}

        <p>
          To learn if there is a free tax clinic that may be able to assist
          petitioner(s), visit the Court’s website,{' '}
          <a href="https://ustaxcourt.gov/resources/clinics/clinics.pdf">
            https://ustaxcourt.gov/resources/clinics/clinics.pdf
          </a>
          . Any tax clinic listed on the website is not affiliated with the
          Court and is not a part of the Internal Revenue Service. The Court
          does not endorse or recommend any particular tax clinic. Petitioners
          who have not already done so are encouraged to contact a tax clinic as
          soon as possible.
        </p>

        <ClerkOfTheCourtSignature
          nameOfClerk={nameOfClerk}
          titleOfClerk={titleOfClerk}
        />
      </div>
    </div>
  );
};
