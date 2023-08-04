import { put } from '../../dynamodbClientService';

export const editPractitionerDocument = async ({
  applicationContext,
  barNumber,
  practitionerDocument,
}: {
  applicationContext: IApplicationContext;
  barNumber: string;
  practitionerDocument: RawPractitionerDocument;
}) => {
  barNumber = barNumber.toLowerCase();

  await put({
    Item: {
      ...practitionerDocument,
      pk: `practitioner|${barNumber}`,
      sk: `document|${practitionerDocument.practitionerDocumentFileId}`,
    },
    applicationContext,
  });
};
