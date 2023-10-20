import { RawIrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { RawPrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
import { fieldsToOmitBeforePersisting } from '@web-api/persistence/dynamo/cases/createCase';

type CaseFieldsToOmitBeforePersisting =
  (typeof fieldsToOmitBeforePersisting)[number];

export type TDynamoRecord<T = Record<string, any>> = {
  pk: string;
  sk: string;
  gsi1pk?: string;
  gsi2pk?: string;
  ttl?: number;
} & T;

export type DocketEntryDynamoRecord = TDynamoRecord<RawDocketEntry>;
export type UserRecord = TDynamoRecord & RawUser;

export type OutboxDynamoRecord = TDynamoRecord<RawOutboxItem>;

export type IrsPractitionerOnCaseRecord = TDynamoRecord<RawIrsPractitioner>;

export type PrivatePractitionerOnCaseRecord =
  TDynamoRecord<RawPrivatePractitioner>;

export type CaseRecord = TDynamoRecord<
  Omit<RawCase, CaseFieldsToOmitBeforePersisting>
>;
