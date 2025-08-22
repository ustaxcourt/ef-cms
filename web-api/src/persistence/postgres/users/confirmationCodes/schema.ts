import { Selectable, Insertable, Updateable } from 'kysely';

const DEFAULT = {};

export const userConfirmationCodeTableDefinition = {
  userId: DEFAULT as string,
  confirmationCode: DEFAULT as string,
  ttl: DEFAULT as number,
};

export type UserConfirmationCodeTable =
  typeof userConfirmationCodeTableDefinition;

export const DW_USER_CONFIRMATION_CODE_COLUMNS = Object.keys(
  userConfirmationCodeTableDefinition,
) as Array<keyof UserConfirmationCodeTable>;

export type UserConfirmationCodeKysely = Selectable<UserConfirmationCodeTable>;
export type NewUserConfirmationCodeKysely =
  Insertable<UserConfirmationCodeTable>;
export type UpdateUserConfirmationCodeKysely =
  Updateable<UserConfirmationCodeTable>;
