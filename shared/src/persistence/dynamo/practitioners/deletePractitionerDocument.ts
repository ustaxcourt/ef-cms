import * as client from '../../dynamodbClientService';

exports.deletePractitionerDocument = async ({
  applicationContext,
  barNumber,
  practitionerDocumentFileId,
}: {
  applicationContext: IApplicationContext;
  barNumber: string;
  practitionerDocumentFileId: string;
}) => {
  barNumber = barNumber.toLowerCase();
  await client.remove({
    applicationContext,
    key: {
      pk: `practitioner|${barNumber}`,
      sk: `document|${practitionerDocumentFileId}`,
    },
  });
};
