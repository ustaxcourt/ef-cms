import { RawCaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { getLogger } from 'aws-xray-sdk';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { upsertCaseWorksheets } from '@web-api/persistence/postgres/caseWorksheets/upsertCaseWorksheets';

export const processCaseWorksheetEntries = async ({
  caseWorksheetRecords,
}: {
  caseWorksheetRecords: any[];
}) => {
  if (!caseWorksheetRecords.length) return;

  getLogger().debug(
    `going to upsert ${caseWorksheetRecords.length} case worksheet records`,
  );

  await upsertCaseWorksheets(
    caseWorksheetRecords.map(record => {
      return unmarshall(record.dynamodb.NewImage) as RawCaseWorksheet;
    }),
  );
};
