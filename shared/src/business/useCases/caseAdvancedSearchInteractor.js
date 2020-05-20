const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { caseSearchFilter } = require('../utilities/caseFilter');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * caseAdvancedSearchInteractor
 *
 * @param {object} providers the providers object containing applicationContext, countryType, petitionerName, petitionerState, yearFiledMax, yearFiledMin
 * @returns {object} the case data
 */
exports.caseAdvancedSearchInteractor = async ({
  applicationContext,
  countryType,
  petitionerName,
  petitionerState,
  yearFiledMax,
  yearFiledMin,
}) => {
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

  const filteredCases = caseSearchFilter(foundCases, authorizedUser);

  return filteredCases;
};
