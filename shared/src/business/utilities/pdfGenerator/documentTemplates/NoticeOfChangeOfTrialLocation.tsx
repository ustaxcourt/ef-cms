import { DocketHeader } from '@shared/business/utilities/pdfGenerator/components/DocketHeader';
import { PrimaryHeader } from '@shared/business/utilities/pdfGenerator/components/PrimaryHeader';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import React from 'react';

export const NoticeOfChangeOfTrialLocation = ({
  caseCaptionExtension,
  caseTitle,
  docketNumberWithSuffix,
  trialSession,
}: {
  caseCaptionExtension: string;
  caseTitle: string;
  docketNumberWithSuffix: string;
  trialSession: RawTrialSession;
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
