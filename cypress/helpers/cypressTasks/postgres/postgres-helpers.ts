import { getDbReader, getDbWriter } from '@web-api/database';

export const getRawFeatureFlagFromPostgresValue = async ({
  flag,
}: {
  flag: string;
}): Promise<boolean | null> => {
  const RESULTS = await getDbReader(async reader =>
    reader
      .selectFrom('dwFeatureFlag')
      .selectAll()
      .where('name', '=', flag)
      .execute(),
  );

  if (!RESULTS.length) return null;
  return RESULTS[0].value.current;
};

export async function toggleFeatureFlagFromPostgres({
  flag,
  flagValue,
}: {
  flag: string;
  flagValue: any;
}): Promise<null> {
  console.log('flag', flag);
  console.log('flagValue', flagValue);

  await getDbWriter({
    cb: writer =>
      writer
        .insertInto('dwFeatureFlag')
        .values({ name: flag, value: { current: flagValue } })
        .onConflict(oc =>
          oc.column('name').doUpdateSet({
            value: { current: flagValue },
          }),
        )
        .execute(),
    table: null,
  });

  return null;
}
