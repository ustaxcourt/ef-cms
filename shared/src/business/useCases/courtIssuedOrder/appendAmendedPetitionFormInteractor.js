const {
  AMENDED_PETITION_FORM_NAME,
} = require('../../entities/EntityConstants');

exports.appendAmendedPetitionFormInteractor = async ({
  applicationContext,
  orderContent,
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
    firstPdf: orderContent,
    secondPdf: amendedPetitionFormData,
  });

  //todo: return something else but buffer!
  return Buffer.from(combinedPdf);
};
