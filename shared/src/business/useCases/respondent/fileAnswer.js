const { UnprocessableEntityError } = require('../../../errors/errors');
const Case = require('../../entities/Case');
const Document = require('../../entities/Document');

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

  const user = await applicationContext.getUseCases().getUser(userId);

  //upload to S3 return uuid
  const answerDocumentId = await applicationContext
    .getPersistenceGateway()
    .uploadDocument({
      applicationContext,
      answerDocument,
    });

  const answerDocumentMetadata = {
    documentType: Case.documentTypes.answer,
    documentId: answerDocumentId,
    userId: userId,
    createdAt: new Date().toISOString(),
  };

  const caseWithAnswer = new Case({
    ...caseToUpdate,
    respondentId: userId,
    respondentBar: user.barNumber,
    respondentFirstName: user.firstName,
    respondentLastName: user.lastName,
    documents: [...caseToUpdate.documents, answerDocumentMetadata],
  });

  caseWithAnswer.validateWithError(new UnprocessableEntityError());

  const updatedCase = await applicationContext.getUseCases().updateCase({
    caseId: caseWithAnswer.caseId,
    caseDetails: caseWithAnswer.toJSON(),
    userId,
    applicationContext,
  });

  new Case(updatedCase).validate();

  return new Document(answerDocumentMetadata).validate().toJSON();
};
