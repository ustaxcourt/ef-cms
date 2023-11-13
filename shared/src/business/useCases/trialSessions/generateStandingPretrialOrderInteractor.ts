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
 * generateStandingPretrialOrderInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docketNumber for the case
 * @param {string} providers.trialSessionId the id for the trial session
 * @returns {Uint8Array} notice of trial session pdf
 */
export const generateStandingPretrialOrderInteractor = async (
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

  const { startDate } = trialSession;
  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseDetail);

  const formattedStartDateWithDayOfWeek = formatDateString(
    startDate,
    FORMATS.MONTH_DAY_YEAR_WITH_DAY_OF_WEEK,
  );

  const formattedStartDate = formatDateString(
    startDate,
    FORMATS.MONTH_DAY_YEAR,
  );

  const formattedJudgeName = await getJudgeWithTitle({
    applicationContext,
    judgeUserName: trialSession.judge.name,
  });

  const trialStartTimeIso = createISODateString(
    trialSession.startTime,
    'HH:mm',
  );
  const formattedStartTime = formatDateString(trialStartTimeIso, 'TIME');

  const formattedServedDate = formatNow(FORMATS.MMDDYY);

  const formattedChambersPhoneNumber = formatPhoneNumber(
    trialSession.chambersPhoneNumber,
  );

  let formattedTrialLocation = trialSession.trialLocation;

  if (trialSession.proceedingType === TRIAL_SESSION_PROCEEDING_TYPES.remote) {
    formattedTrialLocation += ' - Remote Proceedings';
  }

  const pdfData = await applicationContext
    .getDocumentGenerators()
    .standingPretrialOrder({
      applicationContext,
      data: {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix: caseDetail.docketNumberWithSuffix,
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
