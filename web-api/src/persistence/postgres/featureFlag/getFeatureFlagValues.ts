import { getDbReader } from '@web-api/database';

export async function getFeatureFlagValues(featureFlags: string[]) {
  return await getDbReader(reader => {
    return reader
      .selectFrom('dwFeatureFlag')
      .selectAll()
      .where('name', 'in', featureFlags)
      .execute();
  });
}
