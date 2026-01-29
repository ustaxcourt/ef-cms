import { toKyselyNewCase } from '@web-api/persistence/postgres/cases/mapper';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';
import {
  GeocodeDataLatLng,
  getLatLngByCityState,
} from '@web-api/persistence/postgres/geocodeData/getLatLngByCityState';

export const upsertCases = async (rawCases: RawCase[]) => {
  if (rawCases.length === 0) return;

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

  const casesToUpsert = await Promise.all(
    rawCases.map(async rawCase => {
      const petitioners = rawCase.petitioners || [];
      const petitionersWithGeocodes = await Promise.all(
        petitioners.map(async petitioner => {
          const geocode = await getCachedLatLng({
            city: petitioner.city,
            state: petitioner.state,
          });
          return {
            ...petitioner,
            lat: geocode?.lat ?? null,
            lng: geocode?.lng ?? null,
          };
        }),
      );

      return toKyselyNewCase({
        ...rawCase,
        petitioners: petitionersWithGeocodes,
      });
    }),
  );

  await pgInsertInto({
    table: 'dwCase',
    values: casesToUpsert,
    onConflictColumns: ['docketNumber'],
  });
};
