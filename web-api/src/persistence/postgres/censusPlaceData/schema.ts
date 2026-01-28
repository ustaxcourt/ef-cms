import { Insertable, Selectable, Updateable } from 'kysely';

const DEFAULT = {};

export const censusPlaceDataTableDefinition = {
  city: DEFAULT as string,
  state: DEFAULT as string,
  lat: DEFAULT as number | null,
  lng: DEFAULT as number | null,
};

export type CensusPlaceDataTable = typeof censusPlaceDataTableDefinition;

export const CENSUS_PLACE_DATA_COLUMNS = Object.keys(
  censusPlaceDataTableDefinition,
) as Array<keyof CensusPlaceDataTable>;

export type CensusPlaceDataKysely = Selectable<CensusPlaceDataTable>;
export type NewCensusPlaceDataKysely = Insertable<CensusPlaceDataTable>;
export type UpdateCensusPlaceDataKysely = Updateable<CensusPlaceDataTable>;
