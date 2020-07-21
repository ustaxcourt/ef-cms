const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case, isAssociatedUser } = require('../entities/cases/Case');
const { caseSealedFormatter } = require('../utilities/caseFilter');
const { NotFoundError, UnauthorizedError } = require('../../errors/errors');
const { PublicCase } = require('../entities/cases/PublicCase');

const getDocumentContentsForDocuments = async ({
  applicationContext,
  documents,
}) => {
  for (const document of documents) {
    if (document.documentContentsId) {
      try {
        const documentContentsFile = await applicationContext
          .getPersistenceGateway()
          .getDocument({
            applicationContext,
            documentId: document.documentContentsId,
            protocol: 'S3',
            useTempBucket: false,
          });

        const documentContentsData = JSON.parse(
          documentContentsFile.toString(),
        );
        document.documentContents = documentContentsData.documentContents;
        document.draftState = {
          ...document.draftState,
          documentContents: documentContentsData.documentContents,
          richText: documentContentsData.richText,
        };
      } catch (e) {
        applicationContext.logger.error(
          `Document contents ${document.documentContentsId} could not be found in the S3 bucket.`,
        );
      }
    }
  }

  return documents;
};

/**
 * getCaseInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case to get
 * @returns {object} the case data
 */
exports.getCaseInteractor = async ({ applicationContext, docketNumber }) => {
  let caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  if (!caseRecord) {
    const error = new NotFoundError(`Case ${docketNumber} was not found.`);
    error.skipLogging = true;
    throw error;
  }

  if (
    !isAuthorized(
      applicationContext.getCurrentUser(),
      ROLE_PERMISSIONS.GET_CASE,
      caseRecord.userId,
    )
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  let caseDetailRaw;

  if (caseRecord.sealedDate) {
    let isAuthorizedUser =
      isAuthorized(
        applicationContext.getCurrentUser(),
        ROLE_PERMISSIONS.VIEW_SEALED_CASE,
        caseRecord.userId,
      ) ||
      isAssociatedUser({
        caseRaw: caseRecord,
        user: applicationContext.getCurrentUser(),
      });
    if (isAuthorizedUser) {
      caseDetailRaw = new Case(caseRecord, {
        applicationContext,
      })
        .validate()
        .toRawObject();

      caseDetailRaw.documents = await getDocumentContentsForDocuments({
        applicationContext,
        documents: caseDetailRaw.documents,
      });
    } else {
      caseRecord = caseSealedFormatter(caseRecord);
      caseDetailRaw = new PublicCase(caseRecord, {
        applicationContext,
      })
        .validate()
        .toRawObject();
    }
  } else {
    caseDetailRaw = new Case(caseRecord, {
      applicationContext,
    })
      .validate()
      .toRawObject();

    caseDetailRaw.documents = await getDocumentContentsForDocuments({
      applicationContext,
      documents: caseDetailRaw.documents,
    });
  }
  return caseDetailRaw;
};
