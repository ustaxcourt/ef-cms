import { getDbReader } from '@web-api/database';
import { DEFAULT_FILTERED_BLOCKED_CASE_STATUSES } from '@shared/business/entities/EntityConstants';
import { blockedCasesQuery } from '@web-api/persistence/postgres/cases/reports/getBlockedCasesForTrialLocation';

export const getBlockedCasesCount = async (trialLocation: string) => {
  const caseCount = await getDbReader(reader => {
    return blockedCasesQuery({ db: reader, trialLocation })
      .where('status', 'in', DEFAULT_FILTERED_BLOCKED_CASE_STATUSES)
      .select(reader.fn.countAll().as('count'))
      .executeTakeFirst();
  });

  return Number(caseCount?.count) || 0;
};
