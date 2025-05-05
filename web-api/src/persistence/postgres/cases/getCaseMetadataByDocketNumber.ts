import { fromKyselyCase } from '@web-api/persistence/postgres/cases/mapper';
import { getDbReader } from '@web-api/database';
import { Case } from '@shared/business/entities/cases/Case';
import { getCaseStatistics } from '@web-api/persistence/postgres/cases/statistics/getCaseStatistics';

export const getCaseMetadataByDocketNumber = async ({
  docketNumber,
}: {
  docketNumber: string;
}): Promise<
  | Omit<
      RawCase,
      'consolidatedCases' | 'correspondence' | 'hearings' | 'docketEntries'
    >
  | undefined
> => {
  const [dbCaseMetadata, statistics] = await Promise.all([
    getDbReader(reader =>
      reader
        .selectFrom('dwCase as c')
        .selectAll('c')
        .where('c.docketNumber', '=', docketNumber)
        .groupBy('c.docketNumber')
        .executeTakeFirst(),
    ),
    getCaseStatistics({ docketNumber }),
  ]);

  // Note that json_agg will get [null] if there are no petitioners on the case, so filter out nulls
  return dbCaseMetadata
    ? fromKyselyCase({
        ...dbCaseMetadata,
        statistics,
        petitioners: (dbCaseMetadata.petitioners as TPetitioner[]).filter(
          p => p,
        ), // This is a hack because our typing for Petitioners is yucky
        docketNumberWithSuffix: Case.getDocketNumberWithSuffix({
          docketNumber: dbCaseMetadata.docketNumber,
          docketNumberSuffix: dbCaseMetadata.docketNumberSuffix,
        }),
      })
    : undefined;
};
