import { Selectable, Insertable, Updateable } from 'kysely';

const DEFAULT = {};

// TODO: This is just a stub to get things out of Open Search and into Postgres
export const docketEntryTableDefinition = {
  createdAt: DEFAULT as Date,
  docketEntryId: DEFAULT as string,
  docketNumber: DEFAULT as string,
  documentTitle: DEFAULT as string,
  documentType: DEFAULT as string,
  eventCode: DEFAULT as string,
  filingDate: DEFAULT as Date,
  isLegacyServed: DEFAULT as boolean,
  pending: DEFAULT as boolean,
  receivedAt: DEFAULT as Date,
  servedAt: DEFAULT as Date | null,
  isStricken: DEFAULT as boolean | null,
  judge: DEFAULT as string | null,
  signedJudgeName: DEFAULT as string | null,
  isSealed: DEFAULT as boolean | null,
  sealedTo: DEFAULT as string | undefined,
  numberOfPages: DEFAULT as number | undefined,
};

export type DocketEntryTable = typeof docketEntryTableDefinition;

export const DW_DOCKET_ENTRY_COLUMNS = Object.keys(
  docketEntryTableDefinition,
) as Array<keyof DocketEntryTable>;

export type DocketEntryKysely = Selectable<DocketEntryTable>;
export type NewDocketEntryKysely = Insertable<DocketEntryTable>;
export type UpdateDocketEntryKysely = Updateable<DocketEntryTable>;