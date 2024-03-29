import { CHIEF_JUDGE } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const createCsvCustomCaseReportFileAction = async ({
  applicationContext,
  get,
}: ActionProps<{ fileName: string; csvString: string }>) => {
  const filterValues = get(state.customCaseReport.filters);
  const currentJudges = get(state.judges);
  const clientConnectionId = get(state.clientConnectionId);

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

  await applicationContext
    .getUseCases()
    .createCsvCustomCaseReportFileInteractor(applicationContext, {
      ...filterValues,
      clientConnectionId,
      endDate: formattedEndDate,
      judges: judgesIds,
      startDate: formattedStartDate,
      totalCount,
    });
};
