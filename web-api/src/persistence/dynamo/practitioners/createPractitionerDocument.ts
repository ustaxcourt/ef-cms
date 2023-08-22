import * as client from '../../dynamodbClientService';

export const createPractitionerDocument = async ({
  applicationContext,
  barNumber,
  practitionerDocument,
}: {
  applicationContext: IApplicationContext;
  barNumber: string;
  practitionerDocument: RawPractitionerDocument;
}) => {
  barNumber = barNumber.toLowerCase();

  await client.put({
    Item: {
      ...practitionerDocument,
      pk: `practitioner|${barNumber}`,
      sk: `document|${practitionerDocument.practitionerDocumentFileId}`,
    },
    applicationContext,
  });
};
