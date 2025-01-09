import { DocketHeader } from '@shared/business/utilities/pdfGenerator/components/DocketHeader';
import { PrimaryHeader } from '@shared/business/utilities/pdfGenerator/components/PrimaryHeader';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import React from 'react';

export type TrialSessionLocationChangeInfo = Pick<
  RawTrialSession,
  'trialSessionId'
>;

export const NoticeOfChangeOfTrialLocation = ({
  caseCaptionExtension,
  caseTitle,
  docketNumberWithSuffix,
  trialSession,
}: {
  caseCaptionExtension: string;
  caseTitle: string;
  docketNumberWithSuffix: string;
  trialSession: TrialSessionLocationChangeInfo;
}) => {
  return (
    <div>
      <PrimaryHeader />
      <DocketHeader
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
        documentTitle="NOTICE OF CHANGE OF TRIAL LOCATION"
      />
      TEST WIP THIS IS WHERE WE SEE LOCATION CHANGE INFO{' '}
      {docketNumberWithSuffix}, {trialSession.trialSessionId}
    </div>
  );
};
