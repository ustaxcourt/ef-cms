import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

export async function updateMaintenanceMode(
  maintenanceMode: boolean,
): Promise<void> {
  await await pgInsertInto({
    table: 'dwFeatureFlag',
    values: { name: 'maintenance-mode', value: { current: maintenanceMode } },
    onConflictColumns: ['name'],
  });
}
