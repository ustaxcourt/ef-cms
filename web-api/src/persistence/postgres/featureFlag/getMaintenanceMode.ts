import { getFeatureFlagValues } from '@web-api/persistence/postgres/featureFlag/getFeatureFlagValues';

/**
 * getMaintenanceMode
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Promise<string>} the value of the maintenance-mode flag on the dynamodb deploy table
 */
export function getMaintenanceMode() {
  return getFeatureFlagValues(['maintenance-mode']).then(POSTGRES_RECORDS => {
    if (!POSTGRES_RECORDS) return { current: false };
    if (!POSTGRES_RECORDS.length) return { current: false };
    const MAINTENANCE_RECORD = POSTGRES_RECORDS[0];
    return MAINTENANCE_RECORD.value;
  });
}
