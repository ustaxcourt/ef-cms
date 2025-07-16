import { fromKyselyCase } from '@web-api/persistence/postgres/cases/mapper';
import { getDbReader } from '@web-api/database';
import { Case } from '@shared/business/entities/cases/Case';

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
  const dbCaseMetadata = await getDbReader(reader =>
    reader
      .selectFrom('dwCase as c')
      .selectAll('c')
      .where('c.docketNumber', '=', docketNumber)
      .executeTakeFirst(),
  );

  return dbCaseMetadata
    ? fromKyselyCase({
        ...dbCaseMetadata,
        docketNumberWithSuffix: Case.getDocketNumberWithSuffix({
          docketNumber: dbCaseMetadata.docketNumber,
          docketNumberSuffix: dbCaseMetadata.docketNumberSuffix,
        }),
      })
    : undefined;
};
