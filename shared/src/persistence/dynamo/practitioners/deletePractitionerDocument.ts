import * as client from '../../dynamodbClientService';

exports.deletePractitionerDocument = async ({
  applicationContext,
  barNumber,
  documentId,
}: {
  applicationContext: IApplicationContext;
  barNumber: string;
  documentId: string;
}) => {
  barNumber = barNumber.toLowerCase();
  await client.remove({
    applicationContext,
    key: {
      pk: `practitioner|${barNumber}`,
      sk: `document|${documentId}`,
    },
  });
};
