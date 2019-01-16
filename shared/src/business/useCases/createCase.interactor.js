const Case = require('../entities/Case');
const WorkItem = require('../entities/WorkItem');
const Document = require('../entities/Document');
const Message = require('../entities/Message');

const {
  isAuthorized,
  PETITION,
} = require('../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../errors/errors');
const { PETITIONS_SECTION } = require('../entities/WorkQueue');
/**
 * createCase
 *
 * @param petition
 * @param documents
 * @param applicationContext
 * @returns {Promise<*|{caseId}>}
 */
exports.createCase = async ({ petition, documents, applicationContext }) => {
  const user = applicationContext.getCurrentUser();
  if (!isAuthorized(user.userId, PETITION)) {
    throw new UnauthorizedError('Unauthorized');
  }
  const Petition = applicationContext.getEntityConstructors().Petition;
  const petitionEntity = new Petition(petition).validate();

  const docketNumber = await applicationContext.docketNumberGenerator.createDocketNumber(
    {
      applicationContext,
    },
  );

  const caseToAdd = new Case({
    userId: user.userId,
    ...petitionEntity.toRawObject(),
    petitioners: [
      {
        ...user.toRawObject(),
      },
    ],
    docketNumber,
    caseTitle: `${
      user.name
    }, Petitioner(s) v. Commissioner of Internal Revenue, Respondent`,
  });

  documents.forEach(document => {
    const documentEntity = new Document({
      ...document,
      userId: user.userId,
      filedBy: `Petitioner ${user.name}`,
    });

    const workItemEntity = new WorkItem({
      sentBy: user.userId,
      caseId: caseToAdd.caseId,
      document: {
        ...document,
        createdAt: documentEntity.createdAt,
      },
      caseStatus: caseToAdd.status,
      assigneeId: null,
      docketNumber: caseToAdd.docketNumber,
      docketNumberSuffix: caseToAdd.docketNumberSuffix,
      section: PETITIONS_SECTION,
      assigneeName: null,
    });
    workItemEntity.addMessage(
      new Message({
        message: `a ${document.documentType} filed by ${
          user.role
        } is ready for review`,
        sentBy: user.name,
        createdAt: new Date().toISOString(),
      }),
    );
    documentEntity.addWorkItem(workItemEntity);
    caseToAdd.addDocument(documentEntity);
  });

  await applicationContext.getPersistenceGateway().saveCase({
    caseToSave: caseToAdd.validate().toRawObject(),
    applicationContext,
  });

  return new Case(caseToAdd).validate().toRawObject();
};
