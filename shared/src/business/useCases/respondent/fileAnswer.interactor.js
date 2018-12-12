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

  // when a irs attorney (respondent) uploads an answer, add the respondent to the case and add the document to the case with type "answer"

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

  const respondent = {
    respondentId: userId,
    barNumber: user.barNumber,
    name: user.name,
    email: user.email,
    addressLine1: user.addressLine1,
    addressLine2: user.addressLine1,
    city: user.addressCity,
    state: user.state,
    zip: user.zip,
    isIRSAttorney: true,
    phone: user.phone,
  };

  const caseWithAnswer = new Case({
    ...caseToUpdate,
    respondent,
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
