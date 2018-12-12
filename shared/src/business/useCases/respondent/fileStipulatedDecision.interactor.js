const { UnprocessableEntityError } = require('../../../errors/errors');
const Case = require('../../entities/Case');
const Document = require('../../entities/Document');

exports.fileStipulatedDecision = async ({
  userId,
  caseToUpdate,
  document,
  applicationContext,
}) => {
  //validate the pdf
  if (!document) {
    throw new UnprocessableEntityError(
      'stipulated decision document cannot be null or invalid',
    );
  }

  const user = await applicationContext.getUseCases().getUser(userId);

  //upload to S3 return uuid
  const documentId = await applicationContext
    .getPersistenceGateway()
    .uploadDocument({
      applicationContext,
      document,
    });

  const stipulatedDecisionDocumentMetadata = {
    documentType: Case.documentTypes.stipulatedDecision,
    documentId: documentId,
    userId: userId,
    createdAt: new Date().toISOString(),
  };

  if (!caseToUpdate.respondent) {
    const respondent = {
      ...user,
      respondentId: userId,
    };

    caseToUpdate = {
      ...caseToUpdate,
      respondent,
    };
  }

  const caseWithAnswer = new Case({
    ...caseToUpdate,
    documents: [...caseToUpdate.documents, stipulatedDecisionDocumentMetadata],
  });

  caseWithAnswer.validateWithError(new UnprocessableEntityError());
  const updatedCase = await applicationContext.getUseCases().updateCase({
    caseId: caseWithAnswer.caseId,
    caseToUpdate: caseWithAnswer.toJSON(),
    userId,
    applicationContext,
  });

  new Case(updatedCase).validate();

  return new Document(stipulatedDecisionDocumentMetadata).validate().toJSON();
};
