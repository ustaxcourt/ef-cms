import { Insertable, Selectable, Updateable } from 'kysely';

const DEFAULT = {};

export const barNumberTableDefinition = {
  year: DEFAULT as number,
  lastUsedNumber: DEFAULT as number,
};

export type BarNumberTable = typeof barNumberTableDefinition;

export const DW_BAR_NUMBER_COLUMNS = Object.keys(
  barNumberTableDefinition,
) as Array<keyof BarNumberTable>;

export type BarNumberKysely = Selectable<BarNumberTable>;
export type NewBarNumberKysely = Insertable<BarNumberTable>;
export type UpdateBarNumberKysely = Updateable<BarNumberTable>;
