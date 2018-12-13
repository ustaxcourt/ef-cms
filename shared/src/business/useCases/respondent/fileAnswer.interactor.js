const { UnprocessableEntityError } = require('../../../errors/errors');
const Case = require('../../entities/Case');
const Document = require('../../entities/Document');

exports.fileAnswer = async ({
  userId,
  caseToUpdate,
  document,
  applicationContext,
}) => {
  //validate the pdf
  if (!document) {
    throw new UnprocessableEntityError(
      'answer document cannot be null or invalid',
    );
  }

  // when a irs attorney (respondent) uploads an answer, add the respondent to the case and add the document to the case with type "answer"

  const user = await applicationContext.getUseCases().getUser(userId);

  //upload to S3 return uuid
  const documentId = await applicationContext
    .getPersistenceGateway()
    .uploadDocument({
      applicationContext,
      document,
    });

  const answerDocumentMetadata = {
    documentType: Case.documentTypes.answer,
    documentId: documentId,
    userId: userId,
    filedBy: 'Respondent',
    createdAt: new Date().toISOString(),
  };

  const respondent = {
    ...user,
    respondentId: userId,
  };

  const caseWithAnswer = new Case({
    ...caseToUpdate,
    respondent,
    documents: [...caseToUpdate.documents, answerDocumentMetadata],
  });

  caseWithAnswer.validateWithError(new UnprocessableEntityError());
  const updatedCase = await applicationContext.getUseCases().updateCase({
    caseId: caseWithAnswer.caseId,
    caseToUpdate: caseWithAnswer.toJSON(),
    userId,
    applicationContext,
  });

  new Case(updatedCase).validate();

  return new Document(answerDocumentMetadata).validate().toJSON();
};
