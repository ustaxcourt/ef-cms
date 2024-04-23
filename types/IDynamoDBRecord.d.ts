import type { AttributeValue, DynamoDBRecord, StreamRecord } from 'aws-lambda';

export interface AttributeValueWithName extends AttributeValue {
  name?: string | undefined;
}

interface IStreamRecord extends StreamRecord {
  NewImage?: { [key: string]: AttributeValueWithName } | undefined;
}

export interface IDynamoDBRecord extends DynamoDBRecord {
  dynamodb?: IStreamRecord | undefined;
}
