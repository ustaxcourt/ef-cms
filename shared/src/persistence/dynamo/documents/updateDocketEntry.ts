import { put } from '../../dynamodbClientService';
import { omit } from 'lodash';

export const updateDocketEntry = ({
  applicationContext,
  docketEntryId,
  docketNumber,
  document,
}: {
  applicationContext: IApplicationContext;
  docketEntryId: string;
  docketNumber: string;
  document: any;
}) =>
  put({
    Item: {
      pk: `case|${docketNumber}`,
      sk: `docket-entry|${docketEntryId}`,
      ...omit(document, 'workItem'),
    },
    applicationContext,
  });
