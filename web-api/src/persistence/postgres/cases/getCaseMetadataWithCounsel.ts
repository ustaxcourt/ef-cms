import { getCaseMetadataByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseMetadataByDocketNumber';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { getPrivatePractitionersOnCase } from '@web-api/persistence/dynamo/practitioners/getPrivatePractitionersOnCase';
import { getIrsPractitionersOnCase } from '@web-api/persistence/dynamo/practitioners/getIrsPractitionersOnCase';

export const getCaseMetadataWithCounsel = async ({
  applicationContext,
  docketNumber,
}: {
  applicationContext: ServerApplicationContext;
  docketNumber: string;
}): Promise<RawCase | undefined> => {
  const [caseMetaData, privatePractitioners, irsPractitioners] =
    await Promise.all([
      getCaseMetadataByDocketNumber({ docketNumber }),
      getPrivatePractitionersOnCase({
        applicationContext,
        docketNumber,
      }),
      getIrsPractitionersOnCase({
        applicationContext,
        docketNumber,
      }),
    ]);

  if (!caseMetaData) {
    return undefined;
  }

  return transformNullToUndefined({
    ...caseMetaData,
    irsPractitioners,
    privatePractitioners,
  });
};
