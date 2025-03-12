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
  const caseMetaData = await getCaseMetadataByDocketNumber({ docketNumber });

  if (!caseMetaData) {
    return undefined;
  }

  const privatePractitioners = await getPrivatePractitionersOnCase({
    applicationContext,
    docketNumber,
  });

  const irsPractitioners = await getIrsPractitionersOnCase({
    applicationContext,
    docketNumber,
  });

  return transformNullToUndefined({
    ...caseMetaData,
    irsPractitioners,
    privatePractitioners,
  });
};
