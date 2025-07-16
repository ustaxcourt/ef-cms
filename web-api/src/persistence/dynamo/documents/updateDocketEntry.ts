import { omit } from 'lodash';
import { put } from '../../dynamodbClientService';

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
