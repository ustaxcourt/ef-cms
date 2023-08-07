import { get } from '../../dynamodbClientService';

export const getPractitionerDocumentByFileId = async ({
  applicationContext,
  barNumber,
  fileId,
}: {
  applicationContext: IApplicationContext;
  barNumber: string;
  fileId: string;
}) => {
  barNumber = barNumber.toLowerCase();

  return await get({
    Key: {
      pk: `practitioner|${barNumber}`,
      sk: `document|${fileId}`,
    },
    applicationContext,
  });
};
