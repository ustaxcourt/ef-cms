import { RawIrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { RawOutboxItem } from '@shared/business/entities/OutboxItem';
import { RawPrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { RawUser } from '@shared/business/entities/User';
import { fieldsToOmitBeforePersisting } from '@web-api/persistence/dynamo/cases/createCase';
import { trialSessionFieldsToOmitBeforePersisting } from '@web-api/persistence/dynamo/trialSessions/updateTrialSession';

type CaseFieldsToOmitBeforePersisting =
  (typeof fieldsToOmitBeforePersisting)[number];

export type TDynamoRecord<T = Record<string, any>> = {
  pk: string;
  sk: string;
  gsi1pk?: string;
  gsiUserBox?: string;
  gsiSectionBox?: string;
  ttl?: number;
} & T;
export type DeleteRequest = {
  DeleteRequest: { Key: { pk: string; sk: string } };
};
export type PutRequest = {
  PutRequest: { Item: TDynamoRecord };
};

export type DocketEntryDynamoRecord = TDynamoRecord<RawDocketEntry>;
export type UserRecord = TDynamoRecord & RawUser;

export type OutboxDynamoRecord = TDynamoRecord<RawOutboxItem>;

export type IrsPractitionerOnCaseRecord = TDynamoRecord<RawIrsPractitioner>;

export type PrivatePractitionerOnCaseRecord =
  TDynamoRecord<RawPrivatePractitioner>;

export type CaseRecord = TDynamoRecord<
  Omit<RawCase, CaseFieldsToOmitBeforePersisting>
>;

type TrialSessionFieldsToOmitBeforePersisting =
  (typeof trialSessionFieldsToOmitBeforePersisting)[number];
export type TrialSessionRecord = TDynamoRecord<
  Omit<RawTrialSession, TrialSessionFieldsToOmitBeforePersisting>
>;
export type TrialSessionPaperPdfRecord = TDynamoRecord<{
  fileId: string;
  title: string;
}>;
