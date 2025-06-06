import { omit } from 'lodash';
import { put } from '../../dynamodbClientService';

export const updateDocketEntry = async ({
  applicationContext,
  docketEntryId,
  docketNumber,
  document,
}: {
  applicationContext: IApplicationContext;
  docketEntryId: string;
  docketNumber: string;
  document: any;
}) => {
  await put({
    Item: {
      pk: `case|${docketNumber}`,
      sk: `docket-entry|${docketEntryId}`,
      ...omit(document, 'workItem'),
    },
    applicationContext,
  });
};
