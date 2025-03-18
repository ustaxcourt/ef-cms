import { getCaseMetadataByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseMetadataByDocketNumber';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { getPrivatePractitionersOnCase } from '@web-api/persistence/dynamo/practitioners/getPrivatePractitionersOnCase';
import { getIrsPractitionersOnCase } from '@web-api/persistence/dynamo/practitioners/getIrsPractitionersOnCase';

export const getCaseMetadataWithCounsel = async ({
  applicationContext,
  docketNumber,
}: {
  applicationContext: ServerApplicationContext;
  docketNumber: string;
}): Promise<
  | Omit<RawCase, 'consolidatedCases' | 'correspondence' | 'docketEntries'>
  | undefined
> => {
  const caseMetaData = await getCaseMetadataByDocketNumber({ docketNumber });

  if (!caseMetaData) {
    return undefined;
  }

  const [privatePractitioners, irsPractitioners] = await Promise.all([
    getPrivatePractitionersOnCase({
      applicationContext,
      docketNumber,
    }),
    getIrsPractitionersOnCase({
      applicationContext,
      docketNumber,
    }),
  ]);

  return {
    ...caseMetaData,
    irsPractitioners,
    privatePractitioners,
  };
};
