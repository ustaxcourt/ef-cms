const { caseSearchFilter } = require('../../utilities/caseFilter');
const { Document } = require('../../entities/Document');

/**
 * opinionPublicSearchInteractor
 *
 * @param {object} providers the providers object containing applicationContext, orderKeyword, caseTitleOrPetitioner, docketNumber, judge, startDate, endDate
 * @param {object} providers.applicationContext application context object
 * @returns {object} the order search results
 */
exports.opinionPublicSearchInteractor = async ({
  applicationContext,
  opinionKeyword,
}) => {
  const opinionSearch = {
    opinionKeyword,
  };

  const rawSearch = opinionSearch;

  const results = await applicationContext
    .getPersistenceGateway()
    .opinionKeywordSearch({
      applicationContext,
      opinionEventCodes: Document.OPINION_DOCUMENT_TYPES,
      ...rawSearch,
    });

  const filteredResults = caseSearchFilter(results, authorizedUser);

  return filteredResults;
};
