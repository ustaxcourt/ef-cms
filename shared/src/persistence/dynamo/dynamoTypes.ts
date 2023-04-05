export type TDynamoRecord = {
  pk: string;
  sk: string;
  gsi1pk?: string;
  gsi2pk?: string;
  ttl?: number;
  [key: string]: any;
};

export type DocketEntryDynamoRecord = RawDocketEntry & TDynamoRecord;

export type OutboxDynamoRecord = RawOutboxItem & TDynamoRecord;
