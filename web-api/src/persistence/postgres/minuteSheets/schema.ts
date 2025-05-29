import { MinuteSheet } from '@shared/business/entities/trialSessionMinutes/MinuteSheet';
import { Insertable, Selectable, Updateable } from 'kysely';

const DEFAULT = {};

export const minuteSheetTableDefinition = {
  trialSessionId: DEFAULT as string,
  docketNumber: DEFAULT as string,
  content: DEFAULT as MinuteSheet,
};

export type MinuteSheetTable = typeof minuteSheetTableDefinition;

export const DW_MINUTE_SHEET_COLUMNS = Object.keys(
  minuteSheetTableDefinition,
) as Array<keyof MinuteSheetTable>;

export type MinuteSheetKysely = Selectable<MinuteSheetTable>;
export type NewMinuteSheetKysely = Insertable<MinuteSheetTable>;
export type UpdateMinuteSheetKysely = Updateable<MinuteSheetTable>;
