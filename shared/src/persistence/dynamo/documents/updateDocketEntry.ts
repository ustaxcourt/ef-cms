import { TransactionBuilder } from '../createTransaction';
import { omit } from 'lodash';
import { put } from '../../dynamodbClientService';

export const updateDocketEntry = ({
  applicationContext,
  docketEntryId,
  docketNumber,
  document,
  transaction,
}: {
  applicationContext: IApplicationContext;
  docketEntryId: string;
  docketNumber: string;
  document: any;
  transaction?: TransactionBuilder;
}) =>
  put({
    Item: {
      pk: `case|${docketNumber}`,
      sk: `docket-entry|${docketEntryId}`,
      ...omit(document, 'workItem'),
    },
    applicationContext,
    transaction,
  });
