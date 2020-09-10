const {
  caseContactAddressSealedFormatter,
  caseSealedFormatter,
} = require('../utilities/caseFilter');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case, isAssociatedUser } = require('../entities/cases/Case');
const { NotFoundError, UnauthorizedError } = require('../../errors/errors');
const { PublicCase } = require('../entities/cases/PublicCase');

const getDocumentContentsForDocuments = async ({
  applicationContext,
  docketEntries,
}) => {
  for (const document of docketEntries) {
    if (document.documentContentsId) {
      try {
        const documentContentsFile = await applicationContext
          .getPersistenceGateway()
          .getDocument({
            applicationContext,
            key: document.documentContentsId,
            protocol: 'S3',
            useTempBucket: false,
          });

        const documentContentsData = JSON.parse(
          documentContentsFile.toString(),
        );
        document.documentContents = documentContentsData.documentContents;
        document.draftOrderState = {
          ...document.draftOrderState,
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

  return docketEntries;
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

  let caseDetailRaw;

  if (
    !isAuthorized(
      applicationContext.getCurrentUser(),
      ROLE_PERMISSIONS.GET_CASE,
      caseRecord.userId,
    )
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

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

      caseDetailRaw.docketEntries = await getDocumentContentsForDocuments({
        applicationContext,
        docketEntries: caseDetailRaw.docketEntries,
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

    caseDetailRaw.docketEntries = await getDocumentContentsForDocuments({
      applicationContext,
      docketEntries: caseDetailRaw.docketEntries,
    });
  }

  caseDetailRaw = caseContactAddressSealedFormatter(
    caseDetailRaw,
    applicationContext.getCurrentUser(),
  );

  return caseDetailRaw;
};
