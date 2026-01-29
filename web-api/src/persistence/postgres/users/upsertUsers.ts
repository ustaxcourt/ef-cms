import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';
import { toKyselyNewUser } from '@web-api/persistence/postgres/users/mapper';
import { RawUser } from '@shared/business/entities/User';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { RawIrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import {
  GeocodeDataLatLng,
  getLatLngByCityState,
} from '@web-api/persistence/postgres/geocodeData/getLatLngByCityState';

export const upsertUsers = async (
  users: (RawUser | RawPractitioner | RawIrsPractitioner)[],
): Promise<void> => {
  const geocodeCache = new Map<string, GeocodeDataLatLng | null>();

  const getCachedLatLng = async ({
    city,
    state,
  }: {
    city?: string;
    state?: string;
  }): Promise<GeocodeDataLatLng | null> => {
    const trimmedCity = city?.trim();
    const trimmedState = state?.trim();
    if (!trimmedCity || !trimmedState) {
      return null;
    }

    const cacheKey = `${trimmedCity.toLowerCase()}|${trimmedState.toLowerCase()}`;
    if (geocodeCache.has(cacheKey)) {
      return geocodeCache.get(cacheKey) || null;
    }

    const geocode = await getLatLngByCityState({
      city: trimmedCity,
      state: trimmedState,
    });
    geocodeCache.set(cacheKey, geocode);
    return geocode;
  };

  const usersWithGeocodes = await Promise.all(
    users.map(async user => {
      const { contact } = user;
      if (!contact) {
        return user;
      }

      const geocode = await getCachedLatLng({
        city: contact.city,
        state: contact.state,
      });

      const lat = geocode?.lat ?? null;
      const lng = geocode?.lng ?? null;

      return {
        ...user,
        contact: {
          ...contact,
          lat,
          lng,
        },
        lat,
        lng,
      };
    }),
  );

  await pgInsertInto({
    table: 'dwUser',
    values: usersWithGeocodes.map(user => toKyselyNewUser(user)),
    onConflictColumns: ['userId'],
  });
};
