import { Insertable, Selectable, Updateable } from 'kysely';

const DEFAULT = {};

// TODO: After 10495, consider redesiging userOnCase "pending" feature. As-is,
// when a practitioner submits a document that requires court approval before
// they are associated with the case, the system creates a "pending" case
// association. This "pending" association is never deleted: it is instead
// orphaned and effectvely overridden by the existence of a record in userOnCase
// that has the same userId-docketNumber combination. What we have below is
// effectively a one-to-one reimlementation of how these associations were
// stored in dynamodb.
export const userOnCasePendingTableDefinition = {
  userId: DEFAULT as string,
  docketNumber: DEFAULT as string,
};

export type UserOnCasePendingTable = typeof userOnCasePendingTableDefinition;

export const DW_USER_ON_CASE_PENDING_COLUMNS = Object.keys(
  userOnCasePendingTableDefinition,
) as Array<keyof UserOnCasePendingTable>;

export type UserOnCasePendingKysely = Selectable<UserOnCasePendingTable>;
export type NewUserOnCasePendingKysely = Insertable<UserOnCasePendingTable>;
export type UpdateUserOnCasePendingKysely = Updateable<UserOnCasePendingTable>;
