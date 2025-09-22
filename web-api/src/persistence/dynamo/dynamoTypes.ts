// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fieldsToOmitBeforePersisting = [
  'archivedCorrespondences',
  'archivedDocketEntries',
  'consolidatedCases',
  'correspondence',
  'docketEntries',
  'hearings',
  'irsPractitioners',
  'privatePractitioners',
] as const;

type CaseFieldsToOmitBeforePersisting =
  (typeof fieldsToOmitBeforePersisting)[number];

export type TDynamoRecord<T = Record<string, any>> = {
  pk: string;
  sk: string;
  gsi1pk?: string;
  gsi2pk?: string;
  ttl?: number;
} & T;
export type DeleteRequest = {
  DeleteRequest: { Key: { pk: string; sk: string } };
};
export type PutRequest = {
  PutRequest: { Item: TDynamoRecord };
};

export type DocketEntryDynamoRecord = TDynamoRecord<RawDocketEntry>;

export type CaseRecord = TDynamoRecord<
  Omit<RawCase, CaseFieldsToOmitBeforePersisting>
>;

export type AccountConfirmationRecord = TDynamoRecord<{
  userId: string;
  confirmationCode: string;
}>;
