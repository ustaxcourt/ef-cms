import { PROCEDURE_TYPES } from '../../../entities/EntityConstants.js';

const React = require('react');
const { DocketHeader } = require('../components/DocketHeader.jsx');
const { PrimaryHeader } = require('../components/PrimaryHeader.jsx');

export const NoticeOfChangeOfTrialJudge = ({
  caseCaptionExtension,
  caseTitle,
  docketNumberWithSuffix,
  trialInfo,
}) => {
  return (
    <div id="notice-of-change-of-trial-judge-pdf">
      <PrimaryHeader />
      <DocketHeader
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
        documentTitle="Notice of Change of Trial Judge"
      />

      <div id="notice-body">
        <p>
          The {trialInfo.trialLocation}, {trialInfo.proceedingType} trial
          session scheduled to begin on {trialInfo.formattedStartDate}, has been
          reassigned from {trialInfo.priorJudgeTitleWithFullName} to{' '}
          {trialInfo.priorJudgeTitleWithFullName}.{' '}
          {trialInfo.priorJudgeTitleWithFullName}’s chambers are located at:
          United States Tax Court, 400 Second St., N.W., Washington, DC 20217, (
          {trialInfo.chambersPhoneNumber}). The Standing Pretrial Order{' '}
          {trialInfo.caseProcedureType === PROCEDURE_TYPES.small &&
            'for Small Tax Cases'}{' '}
          and the Notice Setting Case for Trial for the{' '}
          {trialInfo.formattedStartDate},{trialInfo.proceedingType} trial
          session remains in full force and effect.
        </p>

        <p className="float-right width-third">
          Stephanie A. Servoss
          <br />
          Clerk of the Court
        </p>
      </div>
    </div>
  );
};
