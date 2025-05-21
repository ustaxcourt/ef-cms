import { getDbWriter } from '@web-api/database';

export async function updateMaintenanceMode(
  maintenanceMode: boolean,
): Promise<void> {
  await getDbWriter(writer =>
    writer
      .insertInto('dwFeatureFlag')
      .values({ name: 'maintenance-mode', value: { current: maintenanceMode } })
      .onConflict(oc =>
        oc.column('name').doUpdateSet({
          value: { current: maintenanceMode },
        }),
      )
      .execute(),
  );
}
