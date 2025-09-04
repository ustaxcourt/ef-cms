import { getCypressPostgresDb } from 'cypress/helpers/cypressTasks/postgres/getCypressPostgresDb';

export const getRawFeatureFlagValue = async ({
  flag,
}: {
  flag: string;
}): Promise<boolean | number | string | null> => {
  const POSTGRES_CLIENT = await getCypressPostgresDb();
  const RESULTS = await POSTGRES_CLIENT.selectFrom('dwFeatureFlag')
    .selectAll()
    .where('name', '=', flag)
    .execute();

  if (!RESULTS.length) return null;
  return RESULTS[0].value.current;
};

export async function toggleFeatureFlag({
  flag,
  flagValue,
}: {
  flag: string;
  flagValue: any;
}): Promise<null> {
  const POSTGRES_CLIENT = await getCypressPostgresDb();

  await POSTGRES_CLIENT.insertInto('dwFeatureFlag')
    .values({ name: flag, value: { current: flagValue } })
    .onConflict(oc =>
      oc.column('name').doUpdateSet({
        value: { current: flagValue },
      }),
    )
    .execute();

  return null;
}
