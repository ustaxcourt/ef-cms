import { get } from '../../dynamodbClientService';

export const getDocketEntryOnCase = ({
  applicationContext,
  docketEntryId,
  docketNumber,
}) => {
  return get({
    Key: {
      pk: `case|${docketNumber}`,
      sk: `docket-entry|${docketEntryId}`,
    },
    applicationContext,
  });
};
