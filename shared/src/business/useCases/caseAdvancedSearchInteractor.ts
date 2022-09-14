import { MAX_SEARCH_RESULTS } from '../entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../errors/errors';
import { caseSearchFilter } from '../utilities/caseFilter';

/**
 * caseAdvancedSearchInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object containing countryType, petitionerName, petitionerState, yearFiledMax, yearFiledMin
 * @returns {object} the case data
 */
export const caseAdvancedSearchInteractor = async (
  applicationContext: IApplicationContext,
  {
    countryType,
    petitionerName,
    petitionerState,
    yearFiledMax,
    yearFiledMin,
  }: {
    countryType: string;
    petitionerName: string;
    petitionerState: string;
    yearFiledMax: string;
    yearFiledMin: string;
  },
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
