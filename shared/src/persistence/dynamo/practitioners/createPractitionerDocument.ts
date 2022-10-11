import * as client from '../../dynamodbClientService';

export const createPractitionerDocument = async ({
  applicationContext,
  barNumber,
  practitionerDocument,
}: {
  applicationContext: IApplicationContext;
  barNumber: string;
  practitionerDocument: TPractitionerDocument;
}) => {
  barNumber = barNumber.toLowerCase();

  await client.put({
    Item: {
      ...practitionerDocument,
      pk: `practitioner|${barNumber}`,
      sk: `document|${practitionerDocument.documentId}`,
    },
    applicationContext,
  });
};
