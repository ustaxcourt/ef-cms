import { PROCEDURE_TYPES_MAP } from '../../../entities/EntityConstants.js';
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
      {console.log(caseCaptionExtension)}
      {console.log(docketNumberWithSuffix)}
      <DocketHeader
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
        documentTitle="NOTICE OF CHANGE OF TRIAL JUDGE"
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
          {trialInfo.caseProcedureType === PROCEDURE_TYPES_MAP.small && (
            <span>for Small Tax Cases</span>
          )}{' '}
          and the Notice Setting Case for Trial for the{' '}
          {trialInfo.formattedStartDate}, {trialInfo.proceedingType} trial
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
