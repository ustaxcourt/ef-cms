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
 * @param {object} providers.caseId the caseId of the case to be updated
 * @param {object} providers.docketRecordIndex the index of the docket record entry to be updated
 * @param {object} providers.docketEntryMeta the docket entry metadata
 * @returns {object} the updated case after the documents are added
 */
exports.updateDocketEntryMetaInteractor = async ({
  applicationContext,
  caseId,
  docketEntryMeta,
  docketRecordIndex,
}) => {
  let caseUpdated;
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.EDIT_DOCKET_ENTRY)) {
    throw new UnauthorizedError('Unauthorized to update docket entry');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  if (!caseToUpdate) {
    throw new NotFoundError(`Case ${caseId} was not found.`);
  }

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  const docketRecordEntry = caseEntity.docketRecord.find(record => {
    return record.index === docketRecordIndex;
  });

  const {
    action,
    additionalInfo,
    additionalInfo2,
    attachments,
    certificateOfService,
    certificateOfServiceDate,
    description,
    documentType,
    eventCode,
    filedBy,
    filingDate,
    freeText,
    generatedDocumentTitle,
    judge,
    lodged,
    objections,
    servedAt,
    servedPartiesCode,
  } = docketEntryMeta;

  const docketRecordEntity = new DocketRecord({
    ...docketRecordEntry,
    action: action || docketRecordEntry.action,
    description:
      generatedDocumentTitle || description || docketRecordEntry.description,
    eventCode: eventCode || docketRecordEntry.eventCode,
    filedBy: filedBy || docketRecordEntry.filedBy,
    filingDate: filingDate || docketRecordEntry.filingDate,
    servedPartiesCode: servedPartiesCode || docketRecordEntry.servedPartiesCode,
  });

  if (
    additionalInfo ||
    additionalInfo2 ||
    attachments ||
    certificateOfServiceDate ||
    certificateOfService ||
    documentType ||
    eventCode ||
    filedBy ||
    filingDate ||
    freeText ||
    generatedDocumentTitle ||
    judge ||
    lodged ||
    objections ||
    servedAt
  ) {
    const documentDetail = caseEntity.getDocumentById({
      documentId: docketRecordEntity.documentId,
    });

    let newCertificateOfServiceDate;

    if (certificateOfServiceDate !== null) {
      newCertificateOfServiceDate = certificateOfServiceDate;
    } else {
      newCertificateOfServiceDate = undefined;
    }

    if (documentDetail) {
      const servedAtUpdated = servedAt && servedAt !== documentDetail.servedAt;
      const filingDateUpdated =
        filingDate && filingDate !== documentDetail.filingDate;
      const shouldGenerateCoversheet = servedAtUpdated || filingDateUpdated;

      if (
        !newCertificateOfServiceDate &&
        documentDetail.certificateOfServiceDate
      ) {
        newCertificateOfServiceDate = documentDetail.certificateOfServiceDate;
      }

      const documentEntity = new Document(
        {
          ...documentDetail,
          additionalInfo: additionalInfo || documentDetail.additionalInfo,
          additionalInfo2: additionalInfo2 || documentDetail.additionalInfo2,
          attachments:
            attachments !== null ? attachments : documentDetail.attachments,
          certificateOfService:
            certificateOfService !== null
              ? certificateOfService
              : documentDetail.certificateOfService,
          certificateOfServiceDate: newCertificateOfServiceDate,
          documentTitle: generatedDocumentTitle || documentDetail.title, // setting to null will regenerate it for the coversheet
          documentType: documentType || documentDetail.documentType,
          eventCode: eventCode || documentDetail.eventCode,
          filedBy: filedBy || documentDetail.filedBy,
          filingDate: filingDate || documentDetail.filingDate,
          freeText: freeText || documentDetail.freeText,
          judge: judge || documentDetail.judge,
          lodged: lodged !== null ? lodged : documentDetail.lodged,
          objections: objections || documentDetail.objections,
          servedAt: servedAt || documentDetail.servedAt,
        },
        { applicationContext },
      );

      caseEntity.updateDocketRecordEntry(docketRecordEntity);
      caseEntity.updateDocument(documentEntity);

      await applicationContext.getPersistenceGateway().updateCase({
        applicationContext,
        caseToUpdate: caseEntity.validate().toRawObject(),
      });

      caseUpdated = true;

      if (shouldGenerateCoversheet) {
        // servedAt or filingDate has changed, generate a new coversheet
        await applicationContext.getUseCases().addCoversheetInteractor({
          applicationContext,
          caseId,
          documentId: documentDetail.documentId,
        });
      }
    }
  }

  if (!caseUpdated) {
    caseEntity.updateDocketRecordEntry(docketRecordEntity);

    await applicationContext.getPersistenceGateway().updateCase({
      applicationContext,
      caseToUpdate: caseEntity.validate().toRawObject(),
    });
  }

  return caseEntity.toRawObject();
};
