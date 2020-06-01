const { Case } = require('../entities/cases/Case');

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
 * getOpenCasesInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {object} the open cases data
 */
exports.getOpenCasesInteractor = async ({ applicationContext }) => {
  let openCases;
  let openCasesRaw = [];

  const { userId } = await applicationContext.getCurrentUser();

  openCases = await applicationContext
    .getPersistenceGateway()
    .getOpenCasesByUser({ applicationContext, userId });

  if (openCases) {
    for (let openCase of openCases) {
      let rawCase = new Case(openCase, {
        applicationContext,
      })
        .validate()
        .toRawObject();
      rawCase.documents = await getDocumentContentsForDocuments({
        applicationContext,
        documents: rawCase.documents,
      });
      openCasesRaw.push(rawCase);
    }
  }

  return openCasesRaw;
};
