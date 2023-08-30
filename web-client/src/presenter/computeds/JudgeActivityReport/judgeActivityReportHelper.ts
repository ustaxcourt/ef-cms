import { state } from '@web-client/presenter/app.cerebral';
import { sum, sumBy } from 'lodash';

interface IJudgeActivityReportHelper {
  closedCasesTotal: number | undefined;
  isFormPristine: boolean | undefined;
  opinionsFiledTotal: number | undefined;
  ordersFiledTotal: number | undefined;
  reportHeader: string | undefined;
  showResultsTables: boolean | undefined;
  showSelectDateRangeText: boolean | undefined;
  trialSessionsHeldTotal: number | undefined;
}

export const judgeActivityReportHelper = (
  get: any,
  applicationContext: IApplicationContext,
): IJudgeActivityReportHelper => {
  const { endDate, judgeName, startDate } = get(state.form);

  const { casesClosedByJudge, opinions, orders, trialSessions } = get(
    state.judgeActivityReportData,
  );

  let closedCasesTotal: number = 0,
    trialSessionsHeldTotal: number = 0,
    opinionsFiledTotal: number = 0,
    ordersFiledTotal: number = 0,
    resultsCount: number = 0,
    showSelectDateRangeText: boolean = false;

  const hasFormBeenSubmitted: boolean =
    casesClosedByJudge && opinions && orders && trialSessions;

  if (hasFormBeenSubmitted) {
    closedCasesTotal = sum(Object.values(casesClosedByJudge));

    trialSessionsHeldTotal = sum(Object.values(trialSessions));

    opinionsFiledTotal = sumBy(
      opinions,
      ({ count }: { count: number }) => count,
    );

    ordersFiledTotal = sumBy(orders, ({ count }: { count: number }) => count);

    resultsCount =
      ordersFiledTotal +
      opinionsFiledTotal +
      trialSessionsHeldTotal +
      closedCasesTotal;
  } else {
    showSelectDateRangeText = true;
  }

  const currentDate: string = applicationContext
    .getUtilities()
    .formatDateString(
      applicationContext.getUtilities().prepareDateFromString(),
      applicationContext.getConstants().DATE_FORMATS.MMDDYY,
    );

  const reportHeader: string = `${judgeName} ${currentDate}`;

  return {
    closedCasesTotal,
    isFormPristine: !endDate || !startDate,
    opinionsFiledTotal,
    ordersFiledTotal,
    reportHeader,
    showResultsTables: resultsCount > 0,
    showSelectDateRangeText,
    trialSessionsHeldTotal,
  };
};
