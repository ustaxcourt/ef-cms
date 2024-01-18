import { get } from '../../dynamodbClientService';

export const getCaseMetadataByDocketNumber = ({
  applicationContext,
  docketNumber,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
}): Promise<RawCase> => {
  return get({
    Key: {
      pk: `case|${docketNumber}`,
      sk: `case|${docketNumber}`,
    },
    applicationContext,
  });
};
