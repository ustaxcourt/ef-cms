import { ClerkOfTheCourtSignature } from '@shared/business/utilities/pdfGenerator/components/ClerkOfTheCourtSignature';
import { DocketHeader } from '@shared/business/utilities/pdfGenerator/components/DocketHeader';
import { PrimaryHeader } from '@shared/business/utilities/pdfGenerator/components/PrimaryHeader';
import React from 'react';

export type NoticeOfAssignmentOfJudgeParams = {
  caseCaptionExtension: string;
  caseTitle: string;
  chambersPhoneNumber?: string;
  docketNumberWithSuffix: string;
  judgeTitleWithFullName: string;
  nameOfClerk: string;
  titleOfClerk: string;
};

export const NoticeOfAssignmentOfJudge = ({
  caseCaptionExtension,
  caseTitle,
  chambersPhoneNumber,
  docketNumberWithSuffix,
  judgeTitleWithFullName,
  nameOfClerk,
  titleOfClerk,
}: NoticeOfAssignmentOfJudgeParams) => {
  return (
    <div id="notice-of-assignment-of-judge-pdf">
      <PrimaryHeader />
      <DocketHeader
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
        documentTitle="NOTICE OF ASSIGNMENT OF JUDGE"
      />

      <div id="notice-body">
        <p className="indent-paragraph">
          The parties are hereby notified that a Standing Scheduling Order has
          been issued in this case and that this case has been assigned to{' '}
          {judgeTitleWithFullName}. {judgeTitleWithFullName}’s chambers are
          located at: United States Tax Court, 400 Second St., N.W., Washington,
          DC 20217
          {chambersPhoneNumber && <>, ({chambersPhoneNumber})</>}.
        </p>

        <p className="indent-paragraph">
          Your attention is called to the requirements set out in the Standing
          Scheduling Order that is served with this notice. Your failure to
          comply with that Order may result in dismissal of the case and entry
          of decision against you.
        </p>

        <ClerkOfTheCourtSignature
          nameOfClerk={nameOfClerk}
          titleOfClerk={titleOfClerk}
        />
      </div>
    </div>
  );
};
