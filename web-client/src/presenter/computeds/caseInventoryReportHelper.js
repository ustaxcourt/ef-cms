import { state } from 'cerebral';

export const caseInventoryReportHelper = (get, applicationContext) => {
  const { STATUS_TYPES } = applicationContext.getConstants();
  const { formatCase } = applicationContext.getUtilities();

  const judges = (get(state.judges) || [])
    .map(i => applicationContext.getUtilities().formatJudgeName(i.name))
    .concat('Chief Judge')
    .sort();

  const resultCount = get(state.caseInventoryReportData.totalCount);

  const reportData = get(state.caseInventoryReportData.foundCases) || [];

  const formattedReportData = reportData
    .sort(applicationContext.getUtilities().compareCasesByDocketNumber)
    .map(item => formatCase(applicationContext, item));

  return {
    caseStatuses: Object.values(STATUS_TYPES),
    formattedReportData,
    judges,
    resultCount,
  };
};
