import { state } from 'cerebral';

export const caseInventoryReportHelper = (get, applicationContext) => {
  const { STATUS_TYPES } = applicationContext.getConstants();

  const judges = (get(state.judges) || [])
    .map(i => applicationContext.getUtilities().formatJudgeName(i.name))
    .concat('Chief Judge')
    .sort();

  const resultCount = 0;

  return {
    caseStatuses: STATUS_TYPES,
    judges,
    resultCount,
  };
};
