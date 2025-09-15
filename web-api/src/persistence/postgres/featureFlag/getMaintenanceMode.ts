import { getFeatureFlagValues } from '@web-api/persistence/postgres/featureFlag/getFeatureFlagValues';

export function getMaintenanceMode(): Promise<
  { current: boolean } | undefined
> {
  if (process.env.MAINTENANCE_MODE === 'true') {
    return Promise.resolve({ current: true });
  } else {
    return getFeatureFlagValues(['maintenance-mode'])
      .then(POSTGRES_RECORDS => {
        if (!POSTGRES_RECORDS) return { current: false };
        if (!POSTGRES_RECORDS.length) return { current: false };
        const MAINTENANCE_RECORD = POSTGRES_RECORDS[0];
        return MAINTENANCE_RECORD.value;
      })
      .catch(() => {
        // if we can't connect to postgres, we assume maintence mode on due to critical issues
        return { current: true };
      });
  }

}
