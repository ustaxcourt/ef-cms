import { CHIEF_JUDGE } from '@shared/business/entities/EntityConstants';
import {
  CaseInventory,
  GetCustomCaseReportResponse,
} from '@web-api/business/useCases/caseInventoryReport/getCustomCaseReportInteractor';
import { FORMATS } from '@shared/business/utilities/DateHandler';
import { state } from '@web-client/presenter/app.cerebral';

export const getAllCustomCaseReportDataAction = async ({
  applicationContext,
  get,
}: ActionProps<{ selectedPage: number }>) => {
  const filterValues = get(state.customCaseReport.filters);
  const currentJudges = get(state.judges);

  let formattedStartDate: string | undefined;
  if (filterValues.startDate) {
    const [startMonth, startDay, startYear] = filterValues.startDate.split('/');
    formattedStartDate = applicationContext.getUtilities().createStartOfDayISO({
      day: startDay,
      month: startMonth,
      year: startYear,
    });
  }

  let formattedEndDate: string | undefined;
  if (filterValues.endDate) {
    const [endMonth, endDay, endYear] = filterValues.endDate.split('/');
    formattedEndDate = applicationContext
      .getUtilities()
      .createEndOfDayISO({ day: endDay, month: endMonth, year: endYear });
  }

  let judgesIds: string[] = [];
  if (filterValues.judges?.length) {
    judgesIds = filterValues.judges.map(judgeName => {
      if (judgeName === CHIEF_JUDGE) return judgeName;
      const foundJudge = currentJudges.find(
        judgeMeta => judgeMeta.name === judgeName,
      );
      return foundJudge!.userId;
    });
  }

  const totalCount = get(state.customCaseReport.totalCases);
  let searchAfter = { pk: '', receivedAt: 0 };
  const pageSize = 9000;

  const loops = Math.floor(totalCount / pageSize) + 1;
  const WAIT_TIME = 1500;
  const cases: CaseInventory[] = [];

  for (let index = 0; index < loops; index++) {
    if (index && index % 10 === 0) {
      await new Promise(resolve => {
        setTimeout(() => resolve(null), WAIT_TIME);
      });
    }

    const iterationData: GetCustomCaseReportResponse = await applicationContext
      .getUseCases()
      .getCustomCaseReportInteractor(applicationContext, {
        ...filterValues,
        endDate: formattedEndDate,
        judges: judgesIds,
        pageSize,
        searchAfter,
        startDate: formattedStartDate,
      });

    cases.push(...iterationData.foundCases);
    searchAfter = iterationData.lastCaseId;
  }

  const formattedCases = cases.map(aCase => ({
    ...aCase,
    calendaringHighPriority: aCase.highPriority ? 'yes' : '',
    receivedAt: applicationContext
      .getUtilities()
      .formatDateString(aCase.receivedAt, FORMATS.MMDDYY),
  }));

  return {
    formattedCases,
  };
};
