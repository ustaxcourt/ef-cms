import { DocketHeader } from '../components/DocketHeader';
import { FORMATS, formatDateString } from '../../DateHandler';
import { PrimaryHeader } from '../components/PrimaryHeader';
import React from 'react';

export type ThirtyDayNoticeOfTrialRequiredInfo = {
  caseCaptionExtension: string;
  caseTitle: string;
  docketNumberWithSuffix: string;
  trialLocation: TrialLocation;
  trialDate: string;
  judgeName: string;
};

type TrialLocation = {
  address1: string;
  address2?: string;
  city: string;
  courthouseName?: string;
  postalCode: string;
  state: string;
  isInPerson?: boolean;
};

const TrialLocationBox = ({
  address1,
  address2,
  city,
  courthouseName,
  isInPerson,
  postalCode,
  state,
}: TrialLocation) => {
  return (
    <div className="info-box info-box-trial" id="trial-info">
      <div className="info-box-header">Trial At</div>
      <div className="info-box-content">
        {courthouseName && <div>{courthouseName}</div>}
        <div>{address1}</div>
        {address2 && <div>{address2}</div>}
        <div>
          {city}, {state} {postalCode}
        </div>
        {isInPerson && <div className="text-bold">In Person</div>}
      </div>
    </div>
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

const ClerkOfTheCourtSignature = () => {
  return (
    <p className="float-right width-third">
      Stephanie A. Servoss
      <br />
      Clerk of the Court
    </p>
  );
};

export const ThirtyDayNoticeOfTrial = ({
  caseCaptionExtension,
  caseTitle,
  docketNumberWithSuffix,
  judgeName,
  trialDate,
  trialLocation,
}: ThirtyDayNoticeOfTrialRequiredInfo) => {
  const formattedTrialDate = formatDateString(
    trialDate,
    FORMATS.MONTH_DAY_YEAR_WITH_DAY_OF_WEEK,
  );
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
        <TrialLocationBox
          address1={trialLocation.address1}
          address2={trialLocation.address2}
          city={trialLocation.city}
          courthouseName={trialLocation.courthouseName}
          postalCode={trialLocation.postalCode}
          state={trialLocation.state}
        />

        <JudgeBox judgeName={judgeName} />
        <div className="clear" />
      </div>
      <div id="notice-body">
        <p>
          The parties are reminded that this case is calendared for trial or
          hearing at the Trial Session beginning{' '}
          <span className="text-bold">{formattedTrialDate}</span>. This case
          will remain on the Court’s trial calendar unless: (1) both parties
          sign an agreed decision and submit it to the Court or (2) the Court
          otherwise notifies the parties that it is removing the case from the
          trial calendar. If this case remains on the Court’s trial calendar and
          you fail to appear at the Trial Session, the case may be dismissed.
        </p>

        <p>
          According to the Court’s records, petitioner(s) in this case is (are)
          not represented by counsel. The parties should arrive at the Court by
          <span className="text-bold">
            {' '}
            9 AM local time at the location shown above{' '}
          </span>
          to be ready for the 10 AM calendar call. Arriving by 9:00 AM will
          enable petitioners and Respondent’s counsel to discuss any remaining
          matters pertaining to the case and learn what will be expected if the
          case is to be tried. Petitioners should identify themselves to the
          trial clerk (a Tax Court employee) when they enter the courtroom.
        </p>

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
        <ClerkOfTheCourtSignature />
      </div>
    </div>
  );
};
