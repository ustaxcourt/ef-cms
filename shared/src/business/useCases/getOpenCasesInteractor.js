const { Case } = require('../entities/cases/Case');

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
      openCasesRaw.push(rawCase);
    }
  }

  return openCasesRaw;
};
