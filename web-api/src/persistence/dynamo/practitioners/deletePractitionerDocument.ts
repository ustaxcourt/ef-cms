import { remove } from '../../dynamodbClientService';

export const deletePractitionerDocument = async ({
  applicationContext,
  barNumber,
  practitionerDocumentFileId,
}: {
  applicationContext: IApplicationContext;
  barNumber: string;
  practitionerDocumentFileId: string;
}) => {
  barNumber = barNumber.toLowerCase();
  await remove({
    applicationContext,
    key: {
      pk: `practitioner|${barNumber}`,
      sk: `document|${practitionerDocumentFileId}`,
    },
  });
};
