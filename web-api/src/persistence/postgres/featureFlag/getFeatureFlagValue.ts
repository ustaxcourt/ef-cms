import { CLERK_OF_THE_COURT_CONFIGURATION } from '@shared/business/entities/EntityConstants';
import { getFeatureFlagValues } from '@web-api/persistence/postgres/featureFlag/getFeatureFlagValues';

/**
 * Retrieves a single feature flag and returns its deconstructed `current`
 * value, abstracting the fetch-and-destructure boilerplate that would
 * otherwise be repeated at every call site.
 *
 * @param flagKey the name of the feature flag to retrieve
 * @returns the flag's `current` value, or `undefined` when the flag is absent
 */
export async function getFeatureFlagValue<T>(
  flagKey: string,
): Promise<T | undefined> {
  const [record] = await getFeatureFlagValues([flagKey]);
  return record ? (record.value.current as T) : undefined;
}

export type ClerkOfTheCourtInfo = { name: string; title: string };

/**
 * Retrieves the clerk of the court's name and title from the
 * clerk-of-court-configuration feature flag.
 *
 * @returns the clerk's name and title
 * @throws when the clerk-of-court-configuration feature flag is not found
 */
export async function getClerkOfTheCourtInfo(): Promise<ClerkOfTheCourtInfo> {
  const clerkOfTheCourtInfo = await getFeatureFlagValue<ClerkOfTheCourtInfo>(
    CLERK_OF_THE_COURT_CONFIGURATION,
  );

  if (!clerkOfTheCourtInfo) {
    throw new Error('Clerk of the court configuration not found');
  }

  return clerkOfTheCourtInfo;
}
