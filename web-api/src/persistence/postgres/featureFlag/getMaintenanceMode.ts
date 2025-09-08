import { getFeatureFlagValues } from '@web-api/persistence/postgres/featureFlag/getFeatureFlagValues';

export function getMaintenanceMode(): Promise<
  { current: boolean } | undefined
> {
  return getFeatureFlagValues(['maintenance-mode'])
    .then(POSTGRES_RECORDS => {
      if (!POSTGRES_RECORDS) return { current: false };
      if (!POSTGRES_RECORDS.length) return { current: false };
      const MAINTENANCE_RECORD = POSTGRES_RECORDS[0];
      return MAINTENANCE_RECORD.value;
    })
    .catch(() => undefined);
}
