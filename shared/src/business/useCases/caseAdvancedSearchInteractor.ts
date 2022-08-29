const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { caseSearchFilter } = require('../utilities/caseFilter');
const { MAX_SEARCH_RESULTS } = require('../entities/EntityConstants');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * caseAdvancedSearchInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object containing countryType, petitionerName, petitionerState, yearFiledMax, yearFiledMin
 * @returns {object} the case data
 */
exports.caseAdvancedSearchInteractor = async (
  applicationContext,
  { countryType, petitionerName, petitionerState, yearFiledMax, yearFiledMin },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.ADVANCED_SEARCH)) {
    throw new UnauthorizedError('Unauthorized');
  }

  let foundCases = await applicationContext
    .getPersistenceGateway()
    .caseAdvancedSearch({
      applicationContext,
      searchTerms: {
        countryType,
        petitionerName,
        petitionerState,
        yearFiledMax,
        yearFiledMin,
      },
    });

  const filteredCases = caseSearchFilter(foundCases, authorizedUser).slice(
    0,
    MAX_SEARCH_RESULTS,
  );

  return filteredCases;
};
