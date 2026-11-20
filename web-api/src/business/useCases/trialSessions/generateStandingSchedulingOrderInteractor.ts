import {
  FORMATS,
  formatDateString,
  formatNow,
} from '@shared/business/utilities/DateHandler';
import { NotFoundError } from '@web-api/errors/errors';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { formatTrialNoticePhoneNumber } from '@shared/business/utilities/formatPhoneNumber';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getCaseCaptionMeta } from '@shared/business/utilities/getCaseCaptionMeta';
import { getJudgeWithTitle } from '@web-api/business/utilities/getJudgeWithTitle';
import { getTrialSessionById } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';

export const generateStandingSchedulingOrderInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    docketNumber,
    trialSessionId,
  }: { docketNumber: string; trialSessionId: string },
): Promise<Uint8Array> => {
  const trialSession = await getTrialSessionById({
    trialSessionId,
  });

  if (!trialSession) {
    throw new NotFoundError(`Trial session ${trialSessionId} was not found.`);
  }

  const caseDetail = await getCaseByDocketNumber({
    docketNumber,
  });

  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseDetail);

  const formattedJudgeName = await getJudgeWithTitle({
    judgeUserName: trialSession.judge?.name,
  });

  const pdfData = await applicationContext
    .getDocumentGenerators()
    .standingSchedulingOrder({
      applicationContext,
      data: {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix: caseDetail.docketNumberWithSuffix,
        trialInfo: {
          chambersPhoneNumber:
            formatTrialNoticePhoneNumber(trialSession.chambersPhoneNumber) ||
            '',
          formattedDueDate: formatDateString(
            trialSession.startDate,
            FORMATS.MONTH_DAY_YEAR,
          ),
          formattedDueDateWithDayOfWeek: formatDateString(
            trialSession.startDate,
            FORMATS.MONTH_DAY_YEAR_WITH_DAY_OF_WEEK,
          ),
          formattedJudgeName,
          formattedServedDate: formatNow(FORMATS.MMDDYY),
          trialLocation: trialSession.trialLocation || '',
        },
      },
    });

  return await applicationContext.getUseCaseHelpers().addServedStampToDocument({
    applicationContext,
    pdfData,
  });
};
