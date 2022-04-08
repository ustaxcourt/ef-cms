const {
  AMENDED_PETITION_FORM_NAME,
} = require('../../entities/EntityConstants');

exports.appendAmendedPetitionForm = async ({
  applicationContext,
  oapDocument,
}) => {
  const { Body: amendedPetitionFormData } = await applicationContext
    .getStorageClient()
    .getObject({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: AMENDED_PETITION_FORM_NAME,
    })
    .promise();

  const combinedPdf = await applicationContext.getUtilities().combineTwoPdfs({
    applicationContext,
    firstPdf: oapDocument,
    secondPdf: amendedPetitionFormData,
  });

  //todo: return something else but buffer!
  return Buffer.from(combinedPdf);
};
