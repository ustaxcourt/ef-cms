import { getDbReader } from '@web-api/database';
import { sql } from 'kysely';

export type GeocodeDataLatLng = {
  lat: number;
  lng: number;
};

export const getLatLngByCityState = async ({
  city,
  state,
}: {
  city?: string | null;
  state?: string | null;
}): Promise<GeocodeDataLatLng | null> => {
  const trimmedCity = city?.trim();
  const trimmedState = state?.trim();

  if (!trimmedCity || !trimmedState) {
    return null;
  }

  const result = await getDbReader(reader =>
    reader
      .selectFrom('dwCensusPlaceData')
      .select(['lat', 'lng'])
      .where(sql`trim(city)`, '=', trimmedCity)
      .where(sql`trim(state)`, '=', trimmedState)
      .executeTakeFirst(),
  );

  if (!result?.lat || !result?.lng) {
    return null;
  }

  const lat = Number(result.lat);
  const lng = Number(result.lng);

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return null;
  }

  return { lat, lng };
};
