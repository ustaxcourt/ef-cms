import { getCaseMetadataByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseMetadataByDocketNumber';
import { getPrivatePractitionersOnCase } from '@web-api/persistence/postgres/practitioners/getPrivatePractitionersOnCase';
import { getIrsPractitionersOnCase } from '@web-api/persistence/postgres/practitioners/getIrsPractitionersOnCase';

export const getCaseMetadataWithCounsel = async ({
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
  const [caseMetaData, privatePractitioners, irsPractitioners] =
    await Promise.all([
      getCaseMetadataByDocketNumber({ docketNumber }),
      getPrivatePractitionersOnCase({
        docketNumber,
      }),
      getIrsPractitionersOnCase({
        docketNumber,
      }),
    ]);

  if (!caseMetaData) {
    return undefined;
  }

  return {
    ...caseMetaData,
    irsPractitioners,
    privatePractitioners,
  };
};
