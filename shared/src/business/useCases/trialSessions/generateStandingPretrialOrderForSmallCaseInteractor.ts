import {
  FORMATS,
  createISODateString,
  formatDateString,
  formatNow,
} from '../../utilities/DateHandler';
import { NotFoundError } from '@web-api/errors/errors';
import { TRIAL_SESSION_PROCEEDING_TYPES } from '../../entities/EntityConstants';
import { formatPhoneNumber } from '../../utilities/formatPhoneNumber';
import { getCaseCaptionMeta } from '../../utilities/getCaseCaptionMeta';
import { getJudgeWithTitle } from '../../utilities/getJudgeWithTitle';

/**
 * generateStandingPretrialOrderForSmallCaseInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docketNumber for the case
 * @param {string} providers.trialSessionId the id for the trial session
 * @returns {Uint8Array} notice of trial session pdf
 */
export const generateStandingPretrialOrderForSmallCaseInteractor = async (
  applicationContext: IApplicationContext,
  {
    docketNumber,
    trialSessionId,
  }: { docketNumber: string; trialSessionId: string },
) => {
  const trialSession = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId,
    });

  if (!trialSession) {
    throw new NotFoundError(`Trial session ${trialSessionId} was not found.`);
  }

  const caseDetail = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const { docketNumberWithSuffix } = caseDetail;

  const trialStartTimeIso = createISODateString(
    trialSession.startTime,
    'HH:mm',
  );
  const formattedStartTime = formatDateString(trialStartTimeIso, FORMATS.TIME);

  const formattedServedDate = formatNow(FORMATS.MMDDYY);

  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseDetail);

  const formattedJudgeName = await getJudgeWithTitle({
    applicationContext,
    judgeUserName: trialSession.judge.name,
  });

  const formattedChambersPhoneNumber = formatPhoneNumber(
    trialSession.chambersPhoneNumber,
  );

  const formattedStartDate = formatDateString(
    trialSession.startDate,
    FORMATS.MONTH_DAY_YEAR,
  );

  const formattedStartDateWithDayOfWeek = formatDateString(
    trialSession.startDate,
    FORMATS.MONTH_DAY_YEAR_WITH_DAY_OF_WEEK,
  );

  let formattedTrialLocation = trialSession.trialLocation;

  if (trialSession.proceedingType === TRIAL_SESSION_PROCEEDING_TYPES.remote) {
    formattedTrialLocation += ' - Remote Proceedings';
  }

  const pdfData = await applicationContext
    .getDocumentGenerators()
    .standingPretrialOrderForSmallCase({
      applicationContext,
      data: {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
        trialInfo: {
          ...trialSession,
          chambersPhoneNumber: formattedChambersPhoneNumber,
          formattedJudgeName,
          formattedServedDate,
          formattedStartDate,
          formattedStartDateWithDayOfWeek,
          formattedStartTime,
          formattedTrialLocation,
        },
      },
    });

  return await applicationContext.getUseCaseHelpers().addServedStampToDocument({
    applicationContext,
    pdfData,
  });
};
