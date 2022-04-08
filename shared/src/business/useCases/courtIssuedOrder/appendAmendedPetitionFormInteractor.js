const {
  AMENDED_PETITION_FORM_NAME,
} = require('../../entities/EntityConstants');

exports.appendAmendedPetitionFormInteractor = async (
  applicationContext,
  { orderContent },
) => {
  const { Body: amendedPetitionFormData } = await applicationContext
    .getStorageClient()
    .getObject({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: AMENDED_PETITION_FORM_NAME,
    })
    .promise();

  return await applicationContext.getUtilities().combineTwoPdfs({
    applicationContext,
    firstPdf: new Uint8Array(orderContent),
    secondPdf: new Uint8Array(amendedPetitionFormData),
  });
};
