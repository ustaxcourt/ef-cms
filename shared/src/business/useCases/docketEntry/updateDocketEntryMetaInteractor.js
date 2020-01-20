const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { DocketRecord } = require('../../entities/DocketRecord');
const { Document } = require('../../entities/Document');
const { NotFoundError } = require('../../../errors/errors');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.docketNumber the docket number of the case to be updated
 * @param {object} providers.docketRecordIndex the index of the docket record entry to be updated
 * @param {object} providers.docketEntryMeta the docket entry metadata
 * @returns {object} the updated case after the documents are added
 */
exports.updateDocketEntryMetaInteractor = async ({
  applicationContext,
  docketEntryMeta,
  docketNumber,
  docketRecordIndex,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.EDIT_DOCKET_ENTRY)) {
    throw new UnauthorizedError('Unauthorized to update docket entry');
  }

  const caseToUpdate = applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  if (!caseToUpdate) {
    throw new NotFoundError(`Case ${docketNumber} was not found.`);
  }

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  const docketRecordEntry = caseEntity.docketRecord[docketRecordIndex];

  const { description, filedBy, servedAt, servedParties } = docketEntryMeta;

  const docketRecordEntity = new DocketRecord({
    ...docketRecordEntry,
    description: description || docketRecordEntry.description,
    filedBy: filedBy || docketRecordEntry.filedBy,
  });

  if (servedAt || servedParties) {
    const documentDetail = caseEntity.getDocumentById({
      documentId: docketRecordEntity.documentId,
    });

    const documentEntity = new Document(
      {
        ...documentDetail,
        servedAt: servedAt || documentDetail.servedAt,
        servedParties: servedParties || documentDetail.servedParties,
      },
      { applicationContext },
    );

    caseEntity.updateDocument(documentEntity);
  }

  caseEntity.updateDocketRecordEntry(docketRecordEntity);

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });

  return caseEntity.toRawObject();
};
