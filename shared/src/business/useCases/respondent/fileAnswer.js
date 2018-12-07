const { UnprocessableEntityError } = require('../../../errors/errors');
const Case = require('../../entities/Case');
exports.fileAnswer = async ({
  userId,
  caseToUpdate,
  answerDocument,
  applicationContext,
}) => {
  //validate the pdf
  if (!answerDocument) {
    throw new UnprocessableEntityError(
      'answer document cannot be null or invalid',
    );
  }

  //get upload policy
  const policy = await applicationContext
    .getPersistenceGateway()
    .getUploadPolicy({ applicationContext });

  //upload to S3 return uuid
  const answerDocumentId = await applicationContext
    .getPersistenceGateway()
    .uploadPdf({
      policy,
      file: answerDocument,
    });

  const answerDocumentMetadata = {
    documentType: Case.documentTypes.answer,
    documentId: answerDocumentId,
    userId: userId,
    createdAt: new Date().toISOString(),
  };
  const caseWithAnswer = new Case({
    ...caseToUpdate,
    documents: [...caseToUpdate.documents, answerDocumentMetadata],
  });

  caseWithAnswer.validateWithError(new UnprocessableEntityError());

  return await applicationContext.getUseCases().updateCase({
    caseId: caseWithAnswer.caseId,
    caseDetails: caseWithAnswer,
    userId,
    applicationContext,
  });
};
