import { Insertable, Selectable, Updateable } from 'kysely';

const DEFAULT = {};

export const geocodeDataTableDefinition = {
  city: DEFAULT as string,
  state: DEFAULT as string,
  lat: DEFAULT as number | null,
  lng: DEFAULT as number | null,
};

export type GeocodeDataTable = typeof geocodeDataTableDefinition;

export const GEOCODE_DATA_COLUMNS = Object.keys(
  geocodeDataTableDefinition,
) as Array<keyof GeocodeDataTable>;

export type GeocodeDataKysely = Selectable<GeocodeDataTable>;
export type NewGeocodeDataKysely = Insertable<GeocodeDataTable>;
export type UpdateGeocodeDataKysely = Updateable<GeocodeDataTable>;
