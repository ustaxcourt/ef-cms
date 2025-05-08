import { RawCaseDeadline } from '@shared/business/entities/CaseDeadline';
import { getDawsonLogger } from '@web-api/utilities/logger/getLogger';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { upsertCaseDeadlines } from '@web-api/persistence/postgres/caseDeadlines/upsertCaseDeadlines';

export const processCaseDeadlineEntries = async ({
  caseDeadlineRecords,
}: {
  caseDeadlineRecords: any[];
}) => {
  if (!caseDeadlineRecords.length) return;

  getDawsonLogger().debug(
    `going to upsert ${caseDeadlineRecords.length} case deadline records`,
  );

  await upsertCaseDeadlines(
    caseDeadlineRecords.map(record => {
      return unmarshall(record.dynamodb.NewImage) as RawCaseDeadline;
    }),
  );
};
