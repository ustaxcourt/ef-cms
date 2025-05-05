import { getDbReader } from '@web-api/database';

//TODO: UPDATE FILE NAME TO MATCH METHOD NAME
export async function getFeatureFlagValues(featureFlags: string[]) {
  return await getDbReader(reader => {
    return reader
      .selectFrom('dwFeatureFlag')
      .selectAll()
      .where('name', 'in', featureFlags)
      .execute();
  });
}
